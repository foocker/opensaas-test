# Credit System Architecture

本项目实现了解耦的积分系统，将**充值逻辑**和**扣费逻辑**完全分离。

## 🎯 设计原则

**充值**和**扣费**是两个独立的关注点，应该解耦：

- **充值系统** - 用户如何购买积分（配置在 Stripe Dashboard + `plans.ts`）
- **扣费系统** - AI API 调用如何消耗积分（配置在 `creditPricing.ts`）

这样设计的好处：
- ✅ 可以独立调整充值套餐和AI模型价格
- ✅ 添加新的充值档位不需要修改扣费逻辑
- ✅ 添加新的AI模型只需配置其单价
- ✅ 促销活动（充值赠送）不影响扣费规则

---

## 💰 充值系统 (Credit Recharging)

### 配置文件
- [app/src/payment/plans.ts](app/src/payment/plans.ts) - 定义充值套餐
- [app/.env.server](app/.env.server) - Stripe Price IDs
- Stripe Dashboard - 产品和价格配置

### 充值套餐（当前配置）

| 套餐 | 价格 | 获得积分 | 赠送比例 |
|------|------|----------|----------|
| 10积分充值 | ¥9.9 | 10 | 0% |
| 55积分充值 | ¥50 | 55 | 10% |
| 115积分充值 | ¥100 | 115 | 15% |
| 240积分充值 | ¥200 | 240 | 20% |

### 充值流程
```
用户点击充值
  ↓
PricingPage.tsx → generateCheckoutSession(planId)
  ↓
跳转到 Stripe Checkout
  ↓
支付成功 → Stripe Webhook
  ↓
webhook.ts → updateUserCredits()
  ↓
用户积分增加
```

### 相关文件
- [app/src/payment/plans.ts](app/src/payment/plans.ts) - 套餐定义
- [app/src/payment/PricingPage.tsx](app/src/payment/PricingPage.tsx) - 充值页面UI
- [app/src/payment/operations.ts](app/src/payment/operations.ts) - Stripe Checkout Session生成
- [app/src/payment/stripe/webhook.ts](app/src/payment/stripe/webhook.ts) - Webhook处理

---

## 🤖 扣费系统 (Credit Deduction)

### 配置文件
- [app/src/payment/creditPricing.ts](app/src/payment/creditPricing.ts) - **AI模型单价配置**

### AI模型定价（当前配置）

**nano_api 提供商：**
- `gemini-2.5-flash-image`: **0.08 积分/次**
- `gemini-3-pro-image-preview`: **0.35 积分/次**

其他提供商可以在 `creditPricing.ts` 中添加。

### 扣费流程
```
用户调用 generateImage action
  ↓
operations.ts → imageGeneration(model, prompt)
  ↓
调用 AI API (通过 aiProvider.ts)
  ↓
返回 { model, provider, imageBase64 }
  ↓
getModelCreditCost(provider, model) → 查询单价
  ↓
检查积分余额是否足够
  ↓
扣除积分: credits -= creditCost
```

### 扣费逻辑（关键代码）

**文件：** [app/src/demo-ai-app/operations.ts](app/src/demo-ai-app/operations.ts#L367-L402)

```typescript
// 动态计算积分成本（基于提供商和模型）
const creditCost = getModelCreditCost(result.provider, result.model);

// 检查积分是否足够
if (!hasEnoughCredits(Number(context.user.credits), result.provider, result.model)) {
  throw new HttpError(
    402,
    `Insufficient credits. Required: ${creditCost}, Available: ${context.user.credits}`
  );
}

// 扣除积分（支持小数）
await context.entities.User.update({
  where: { id: context.user.id },
  data: {
    credits: {
      decrement: creditCost,
    },
  },
});
```

### 相关文件
- [app/src/payment/creditPricing.ts](app/src/payment/creditPricing.ts) - **核心配置文件**
- [app/src/demo-ai-app/operations.ts](app/src/demo-ai-app/operations.ts) - 扣费实现
- [app/src/demo-ai-app/aiProvider.ts](app/src/demo-ai-app/aiProvider.ts) - AI API调用

---

## 🗄️ 数据库设计

### User 表 - credits 字段

```prisma
model User {
  credits  Decimal  @default(3) @db.Decimal(10, 2)
  // ...其他字段
}
```

- **类型**: `DECIMAL(10, 2)` - 支持小数点后2位
- **默认值**: `3.00` - 新用户免费获得3积分
- **范围**: 0 - 99,999,999.99 积分

**为什么使用 Decimal？**
- ✅ 支持小数积分（如 0.08, 0.35）
- ✅ 精确计算，避免浮点数误差
- ✅ 适合金融和计费场景

### 积分显示

**文件：** [app/src/user/AccountPage.tsx](app/src/user/AccountPage.tsx#L77)

```tsx
{Number(user.credits).toFixed(2)} credits
```

显示格式：`14.00 credits`

---

## 🔧 如何修改配置

### 修改充值套餐

1. **在 Stripe Dashboard 创建新产品**
   - 访问 https://dashboard.stripe.com/test/products
   - 点击 `+ Add Product`
   - 设置价格和名称
   - 复制 Price ID (格式: `price_xxxxx`)

2. **更新 plans.ts**
   ```typescript
   export enum PaymentPlanId {
     Credits500 = "credits500",  // 新增
   }

   export const paymentPlans = {
     [PaymentPlanId.Credits500]: {
       getPaymentProcessorPlanId: () =>
         requireNodeEnvVar("PAYMENTS_CREDITS_500_PLAN_ID"),
       effect: { kind: "credits", amount: 550 },  // 500+10%赠送
     },
   }
   ```

3. **更新 .env.server**
   ```bash
   PAYMENTS_CREDITS_500_PLAN_ID=price_xxxxx
   ```

4. **更新 PricingPage.tsx**
   - 在 `rechargeOptions` 数组中添加新套餐

### 修改 AI 模型单价

**只需修改一个文件：** [app/src/payment/creditPricing.ts](app/src/payment/creditPricing.ts)

```typescript
export const modelCreditCosts: ModelCreditCost = {
  nano_api: {
    'gemini-2.5-flash-image': 0.08,        // 修改这里
    'gemini-3-pro-image-preview': 0.35,    // 修改这里
    'new-model-name': 0.50,                 // 添加新模型
  },
  // 添加新提供商
  openrouter: {
    'gpt-4-vision': 0.25,
  },
};
```

**无需修改其他任何代码！** 扣费逻辑会自动使用新配置。

### 添加新的 AI 提供商

1. **在 `apiProviders.ts` 中添加提供商配置**
2. **在 `creditPricing.ts` 中添加该提供商的模型定价**

示例：
```typescript
export const modelCreditCosts: ModelCreditCost = {
  nano_api: { /* ... */ },
  new_provider: {
    'model-a': 0.10,
    'model-b': 0.20,
  },
};
```

---

## 🎁 订阅用户特权

订阅用户（Hobby/Pro 套餐）享有：
- ✅ **无限积分** - 不扣除积分
- ✅ 所有模型免费调用
- ✅ 无需担心余额不足

代码逻辑：
```typescript
if (!isUserSubscribed(context.user)) {
  // 只有非订阅用户才扣积分
  const creditCost = getModelCreditCost(provider, model);
  // ...扣费逻辑
}
```

---

## 📊 查看积分余额

用户可以在个人账户页面查看积分余额：

- **路由**: `/account`
- **文件**: [app/src/user/AccountPage.tsx](app/src/user/AccountPage.tsx)
- **显示**: 当前积分余额（保留2位小数）
- **充值按钮**: 非订阅用户可点击 "Buy More Credits" 跳转到充值页面

---

## 🧪 测试

### 测试充值
1. 访问 http://localhost:3000/pricing
2. 点击任意充值套餐
3. 使用测试卡号: `4242 4242 4242 4242`
4. 支付成功后，查看 `/account` 页面，积分应增加

### 测试扣费
1. 访问 http://localhost:3000/demo-app
2. 选择 nano_api 的模型
3. 生成图片
4. 查看服务器日志，应显示：
   ```
   Credit deduction info: {
     provider: 'nano_api',
     model: 'gemini-2.5-flash-image',
     creditCost: 0.08,
     userCredits: 14.00
   }
   Credits decremented by 0.08 for nano_api/gemini-2.5-flash-image
   ```
5. 刷新 `/account` 页面，积分应减少 0.08

---

## 📝 总结

### 架构优势

1. **完全解耦** - 充值和扣费互不影响
2. **配置驱动** - 修改价格只需改配置文件
3. **可扩展** - 轻松添加新模型、新提供商、新充值档位
4. **精确计费** - 使用 Decimal 类型避免浮点数误差
5. **用户友好** - 清晰的积分显示和充值流程

### 关键文件清单

**充值系统：**
- `app/src/payment/plans.ts` - 套餐定义
- `app/src/payment/PricingPage.tsx` - 充值UI
- `app/src/payment/stripe/webhook.ts` - Webhook处理

**扣费系统：**
- `app/src/payment/creditPricing.ts` - **AI模型定价配置（核心）**
- `app/src/demo-ai-app/operations.ts` - 扣费实现
- `app/src/demo-ai-app/aiProvider.ts` - AI API调用

**数据库：**
- `app/schema.prisma` - User.credits 字段定义

**用户界面：**
- `app/src/user/AccountPage.tsx` - 积分余额显示

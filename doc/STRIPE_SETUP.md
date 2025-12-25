# Stripe 支付配置指南

本项目已集成 Stripe 支付功能,支持充值积分模式。以下是完整的配置步骤。

## 🚀 快速开始

### 当前状态
- ✅ 代码已配置完成
- ⚠️ 需要在 Stripe Dashboard 创建产品
- ⚠️ 需要更新 `.env.server` 中的 Price IDs

### 立即配置步骤

1. **登录 Stripe Dashboard**
   - 测试模式: https://dashboard.stripe.com/test/products
   - 确保处于 **Test mode** (右上角开关)

2. **创建 4 个充值产品** (点击 `+ Add Product`)

   **产品 1: 10积分充值**
   - Name: `10积分充值`
   - Price: `9.90 CNY`
   - Billing period: `One time`
   - 点击 Save → 复制 **Price ID** (格式: `price_xxxxx`)

   **产品 2: 55积分充值**
   - Name: `55积分充值 (推荐)`
   - Price: `50.00 CNY`
   - Billing period: `One time`
   - 点击 Save → 复制 **Price ID**

   **产品 3: 115积分充值**
   - Name: `115积分充值`
   - Price: `100.00 CNY`
   - Billing period: `One time`
   - 点击 Save → 复制 **Price ID**

   **产品 4: 240积分充值**
   - Name: `240积分充值`
   - Price: `200.00 CNY`
   - Billing period: `One time`
   - 点击 Save → 复制 **Price ID**

3. **更新 `.env.server`**

   打开 `app/.env.server`,将复制的 Price IDs 替换占位符:

   ```bash
   PAYMENTS_CREDITS_10_PLAN_ID=price_xxxxx   # 替换为产品1的Price ID
   PAYMENTS_CREDITS_50_PLAN_ID=price_xxxxx   # 替换为产品2的Price ID
   PAYMENTS_CREDITS_100_PLAN_ID=price_xxxxx  # 替换为产品3的Price ID
   PAYMENTS_CREDITS_200_PLAN_ID=price_xxxxx  # 替换为产品4的Price ID
   ```

4. **重启开发服务器**
   ```bash
   # 按 Ctrl+C 停止当前服务器
   wasp start
   ```

5. **测试支付**
   - 访问 http://localhost:3000/pricing
   - 点击任意充值套餐
   - 使用测试卡号: `4242 4242 4242 4242`
   - CVV: 任意3位数字
   - 有效期: 任意未来日期

---

## 架构说明

### 解耦设计
1. **定价配置** - 在 Stripe Dashboard 手动创建产品和价格
2. **扣费逻辑** - 在代码中实现(已完成),通过环境变量关联 Stripe 产品

### 支付流程
```
用户点击充值 → generateCheckoutSession(planId)
→ 创建 Stripe Checkout Session
→ 跳转到 Stripe 支付页面
→ 支付完成后 Webhook 回调
→ 自动增加用户积分
```

## Stripe Dashboard 配置步骤

### 1. 创建 Stripe 账号
- 访问 https://dashboard.stripe.com/register
- 完成注册和身份验证

### 2. 获取 API 密钥
进入 https://dashboard.stripe.com/test/apikeys

复制以下密钥:
- **Publishable key** (pk_test_xxx)
- **Secret key** (sk_test_xxx)

### 3. 创建产品 (Products)

进入 **Products** → **Create product**

#### 产品 1: 10 积分充值
- Product name: `10 积分充值`
- Description: `入门充值套餐，获得 10 积分`
- Pricing model: `One time` (一次性付款)
- Price: `9.90 CNY`
- 创建后复制 **Price ID** (类似 `price_xxxxx`)

#### 产品 2: 55 积分充值
- Product name: `55 积分充值`
- Description: `推荐充值套餐，50元获得55积分（赠送10%）`
- Pricing model: `One time`
- Price: `50.00 CNY`
- 创建后复制 **Price ID**

#### 产品 3: 115 积分充值
- Product name: `115 积分充值`
- Description: `超值充值套餐，100元获得115积分（赠送15%）`
- Pricing model: `One time`
- Price: `100.00 CNY`
- 创建后复制 **Price ID**

#### 产品 4: 240 积分充值
- Product name: `240 积分充值`
- Description: `大额充值套餐，200元获得240积分（赠送20%）`
- Pricing model: `One time`
- Price: `200.00 CNY`
- 创建后复制 **Price ID**

### 4. 配置 Webhook

进入 **Developers** → **Webhooks** → **Add endpoint**

- Endpoint URL: `https://your-domain.com/payments-webhook`
- Events to send:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`

点击 **Reveal** 复制 **Signing secret** (whsec_xxx)

## 环境变量配置

在 `.env.server` 文件中添加以下配置:

```bash
# Stripe API Keys
STRIPE_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
PAYMENTS_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# 充值套餐 Price IDs (从 Stripe Dashboard 复制)
PAYMENTS_CREDITS_10_PLAN_ID=price_xxxxx  # 10 积分充值
PAYMENTS_CREDITS_50_PLAN_ID=price_xxxxx  # 55 积分充值
PAYMENTS_CREDITS_100_PLAN_ID=price_xxxxx # 115 积分充值
PAYMENTS_CREDITS_200_PLAN_ID=price_xxxxx # 240 积分充值

# 订阅套餐 (可选,用于未来扩展)
PAYMENTS_HOBBY_SUBSCRIPTION_PLAN_ID=price_xxxxx
PAYMENTS_PRO_SUBSCRIPTION_PLAN_ID=price_xxxxx
```

## 测试

### 测试模式
Stripe 提供测试卡号进行测试:
- 成功支付: `4242 4242 4242 4242`
- CVV: 任意3位数字
- 有效期: 任意未来日期

### 测试流程
1. 启动应用: `wasp start`
2. 访问定价页面: http://localhost:3000/pricing
3. 点击"立即充值"
4. 使用测试卡号完成支付
5. 查看用户积分是否增加

## 生产环境配置

### 1. 切换到生产模式
在 Stripe Dashboard 右上角切换到 **Live mode**

### 2. 重新获取生产环境密钥
- Live Publishable key
- Live Secret key
- Live Webhook secret

### 3. 创建生产环境产品
重复上述步骤在生产环境创建产品

### 4. 更新生产环境变量
将 `.env.server` 中的测试密钥替换为生产密钥

## 积分扣费逻辑

积分扣费已在代码中实现,位于:
- `app/src/demo-ai-app/operations.ts` - generateImage action
- 每次生成图片扣除 1 积分
- 非订阅用户积分不足时返回 402 错误

### 扣费机制
```typescript
if (!isUserSubscribed(context.user)) {
  if (context.user.credits > 0) {
    await context.entities.User.update({
      where: { id: context.user.id },
      data: { credits: { decrement: 1 } }
    });
  } else {
    throw new HttpError(402, "积分不足");
  }
}
```

## 价格调整

如需调整价格:
1. 在 Stripe Dashboard 中修改产品价格
2. 更新 `app/src/payment/PricingPage.tsx` 中的显示金额
3. 不需要修改 Price ID (Stripe 会自动处理)

## 常见问题

### Q: 如何修改赠送积分比例?
A: 修改 `app/src/payment/plans.ts` 中的 `effect.amount` 值

### Q: 支付成功但积分未增加?
A: 检查 Webhook 是否正确配置,查看服务器日志

### Q: 如何支持更多支付方式?
A: Stripe 支持支付宝、微信支付等,在 Dashboard 中启用即可

## 相关文件

- `app/src/payment/plans.ts` - 套餐定义和积分配置
- `app/src/payment/PricingPage.tsx` - 定价页面UI
- `app/src/payment/operations.ts` - 支付 Stripe Checkout Session
- `app/src/payment/webhook.ts` - Webhook 处理逻辑
- `app/src/demo-ai-app/operations.ts` - AI 调用扣费逻辑

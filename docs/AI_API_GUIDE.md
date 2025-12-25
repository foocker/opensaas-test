# 🤖 AI API 集成使用文档

本文档详细介绍如何在 Nano Banana Magic 中使用和配置 AI API 功能。

---

## 📦 架构概览

### 设计原则

Nano Banana Magic 的 AI API 集成采用**多提供商抽象层**设计：

```
┌─────────────────────────────────────────────────────┐
│  业务逻辑层 (operations.ts)                          │
│  - generateDailySchedule()                          │
│  - generateImage()                                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│  AI Provider 抽象层 (aiProvider.ts)                  │
│  - chatCompletion()                                 │
│  - imageGeneration()                                │
│  - 自动重试和故障转移                                 │
└────────────────┬────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         ↓               ↓
┌──────────────┐  ┌──────────────┐
│ Nano API     │  │ OpenRouter   │
│ (优先级 1)    │  │ (优先级 2)    │
└──────────────┘  └──────────────┘
```

**核心优势:**
- ✅ 多提供商自动故障转移
- ✅ 统一的调用接口
- ✅ 独立的积分扣费配置
- ✅ 易于扩展新的 AI 提供商

---

## 🔧 配置 API 提供商

### 文件结构

```
app/src/demo-ai-app/
├── aiProvider.ts         # AI Provider 抽象层（统一接口）
├── apiProviders.ts       # API 提供商配置（支持多个来源）
└── operations.ts         # 业务逻辑（调用 AI API）
```

### API 提供商配置

**文件位置:** [`app/src/demo-ai-app/apiProviders.ts`](app/src/demo-ai-app/apiProviders.ts)

#### 当前支持的提供商

1. **Nano API** (Priority 1)
   - 基础 URL: `https://api.nanobananai.com`
   - 支持 Gemini 系列模型
   - 最高优先级

2. **OpenRouter** (Priority 2)
   - 基础 URL: `https://openrouter.ai/api/v1`
   - 支持所有 OpenRouter 模型
   - 备用提供商

#### 配置示例

```typescript
export const API_PROVIDERS: ApiProviderConfig[] = [
  {
    id: 'nano_api',
    name: 'Nano Banana API',
    apiKeyEnv: 'NANO_API_KEY',
    baseUrl: 'https://api.nanobananai.com',
    enabled: true,
    priority: 1, // 最高优先级
    supportedModels: [
      'google/gemini-2.5-flash',
      'google/gemini-3-pro-preview',
      'google/gemini-2.5-flash-image-preview',
      'google/gemini-3-pro-image-preview'
    ],
    modelMapping: {
      'google/gemini-2.5-flash': 'gemini-2.5-flash',
      'google/gemini-2.5-flash-image-preview': 'gemini-2.5-flash-image',
    },
    timeout: 300000, // 5分钟
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    baseUrl: 'https://openrouter.ai/api/v1',
    enabled: true,
    priority: 2,
    headers: {
      'HTTP-Referer': 'https://www.nbartai.com',
      'X-Title': 'Nano Banana Magic'
    },
    timeout: 300000
  },
];
```

---

## 🔑 环境变量配置

### 服务端环境变量

编辑 `app/.env.server`：

```bash
# Nano API Key
# 获取地址: https://api.nanobananai.com
NANO_API_KEY=your_nano_api_key_here

# OpenRouter API Key（备用）
# 获取地址: https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_key_here

# Grsai API Key（如果使用，当前未配置）
# GRSAI_API_KEY=your_grsai_key_here
```

### 优先级机制

系统会按照 `priority` 数值**从小到大**依次尝试：

1. **Priority 1 (Nano API)** - 优先使用
2. **Priority 2 (OpenRouter)** - Nano API 失败时使用

**自动故障转移:**
- 如果 Nano API 请求失败（404、500、超时等）
- 系统会自动切换到 OpenRouter
- 用户无感知切换，保证服务可用性

---

## 📝 使用示例

### 1. 文本生成（Chat Completion）

#### 基础用法

```typescript
import { chatCompletion } from './aiProvider';

// 调用 AI 生成文本
const result = await chatCompletion(
  [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is TypeScript?' }
  ],
  'google/gemini-2.5-flash', // 模型名称
  0.7,  // temperature
  4096  // max tokens
);

console.log('AI 回复:', result.text);
console.log('使用的提供商:', result.provider); // "nano_api" or "openrouter"
console.log('使用的模型:', result.model);
console.log('Token 使用:', result.promptTokens, result.completionTokens);
```

#### 在 Wasp Action 中使用

**文件位置:** [`app/src/demo-ai-app/operations.ts`](app/src/demo-ai-app/operations.ts)

```typescript
import { HttpError } from 'wasp/server';
import type { GenerateDailySchedule } from 'wasp/server/operations';
import { chatCompletion } from './aiProvider';
import { getModelCreditCost } from '../payment/creditPricing';

export const generateDailySchedule: GenerateDailySchedule = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const messages = [
    {
      role: 'system' as const,
      content: '你是一个专业的日程规划助手...'
    },
    {
      role: 'user' as const,
      content: `请帮我规划今天的任务：${args.tasks.join(', ')}`
    }
  ];

  const model = args.model || 'google/gemini-2.5-flash';

  try {
    // 调用 AI API
    const result = await chatCompletion(messages, model);

    // 扣除积分（如果用户未订阅）
    if (!isUserSubscribed(context.user)) {
      const creditCost = getModelCreditCost(result.provider, result.model);

      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: creditCost } }
      });
    }

    return {
      schedule: result.text,
      model: result.model,
      provider: result.provider,
    };

  } catch (error) {
    console.error('AI API 调用失败:', error);
    throw new HttpError(500, 'AI 服务暂时不可用');
  }
};
```

### 2. 图像生成

#### 基础用法

```typescript
import { imageGeneration } from './aiProvider';

// 生成图像
const result = await imageGeneration({
  model: 'google/gemini-3-pro-image-preview',
  prompt: '一只可爱的猫咪在草地上玩耍',
  aspectRatio: '1:1',     // 可选: 1:1, 16:9, 9:16, 4:3, 3:4
  outputSize: '2K',       // 可选: 1K, 2K, 4K
  images: []              // 可选: Base64 图像数组（用于多模态输入）
});

console.log('Base64 图像数据:', result.imageBase64);
console.log('使用的提供商:', result.provider);
```

#### 在前端使用

**文件位置:** `app/src/landing-page/components/BananaPlayground.tsx`

```typescript
import { useState } from 'react';
import { generateImage } from 'wasp/client/operations';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateImage({
        prompt,
        model: 'google/gemini-2.5-flash-image-preview',
        aspectRatio: '1:1',
        outputSize: '2K',
      });

      // 将 Base64 转换为可显示的图片 URL
      const base64Image = `data:image/png;base64,${result.imageBase64}`;
      setImageUrl(base64Image);

    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="描述你想要的图像..."
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? '生成中...' : '生成图像'}
      </button>

      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
}
```

---

## 💰 积分计费配置

### 积分价格配置

**文件位置:** [`app/src/payment/creditPricing.ts`](app/src/payment/creditPricing.ts)

```typescript
export const modelCreditCosts: ModelCreditCost = {
  nano_api: {
    'gemini-2.5-flash': 0.05,              // 文本生成 - Flash
    'gemini-3-pro-preview': 0.2,           // 文本生成 - Pro
    'gemini-2.5-flash-image': 0.08,        // 图像生成 - Flash
    'gemini-3-pro-image-preview': 0.35,    // 图像生成 - Pro
  },
  openrouter: {
    // OpenRouter 模型价格（根据实际情况配置）
    'google/gemini-2.5-flash': 0.06,
    'anthropic/claude-3-sonnet': 0.3,
  },
};

export function getModelCreditCost(providerId: string, modelId: string): number {
  const providerCosts = modelCreditCosts[providerId];
  if (!providerCosts) return 0;
  const cost = providerCosts[modelId];
  return cost ?? 0;
}
```

### 为什么解耦？

**充值配置** (`plans.ts`) 和 **扣费配置** (`creditPricing.ts`) 完全独立：

```
┌─────────────────────┐      ┌─────────────────────┐
│  充值套餐 (plans.ts) │      │ 模型费用 (pricing)  │
│  - 10 积分: ¥9.99   │      │ - Flash: 0.08/次    │
│  - 55 积分: ¥49.99  │      │ - Pro: 0.35/次      │
│  - 115积分: ¥99.99  │      │                     │
│  - 240积分: ¥199.99 │      │                     │
└─────────────────────┘      └─────────────────────┘
         │                              │
         └──────────┬───────────────────┘
                    ↓
            用户可以独立调整
```

**优势:**
- ✅ 充值价格和模型费用可以独立调整
- ✅ 促销活动不影响模型计费
- ✅ 新增模型只需修改 `creditPricing.ts`

---

## 🔄 添加新的 AI 提供商

### 步骤 1: 添加提供商配置

编辑 [`app/src/demo-ai-app/apiProviders.ts`](app/src/demo-ai-app/apiProviders.ts)：

```typescript
export type ApiProviderType = 'openrouter' | 'nano_api' | 'your_new_provider'; // 添加新类型

export const API_PROVIDERS: ApiProviderConfig[] = [
  // ... 现有配置 ...
  {
    id: 'your_new_provider',
    name: 'Your New Provider',
    apiKeyEnv: 'YOUR_NEW_PROVIDER_API_KEY',
    baseUrl: 'https://api.yourprovider.com',
    enabled: true,
    priority: 3, // 设置优先级
    supportedModels: [
      'your-model-1',
      'your-model-2',
    ],
    modelMapping: {
      'common-model-name': 'provider-specific-model-name',
    },
    timeout: 300000,
  },
];
```

### 步骤 2: 实现 Provider 类

编辑 [`app/src/demo-ai-app/aiProvider.ts`](app/src/demo-ai-app/aiProvider.ts)：

```typescript
class YourNewProvider {
  private config: ApiProviderConfig;
  private apiKey: string;

  constructor(config: ApiProviderConfig, apiKey: string) {
    this.config = config;
    this.apiKey = apiKey;
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const modelName = getMappedModelName(this.config, request.model);

    const response = await fetch(`${this.config.baseUrl}/your-endpoint`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: request.messages,
        // ... 其他参数 ...
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.choices[0].message.content,
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      model: modelName,
      provider: this.config.id,
    };
  }

  // 实现 imageGeneration 方法（如果支持）
  async imageGeneration(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // ... 实现逻辑 ...
  }
}
```

### 步骤 3: 注册 Provider

在 `aiProvider.ts` 的 `chatCompletion()` 函数中添加：

```typescript
export async function chatCompletion(
  messages: ChatCompletionRequest['messages'],
  model: string,
  temperature?: number,
  maxTokens?: number
): Promise<ChatCompletionResponse> {
  // ...

  if (provider.id === 'your_new_provider') {
    const providerInstance = new YourNewProvider(provider, apiKey);
    return await providerInstance.chatCompletion(request);
  }

  // ...
}
```

### 步骤 4: 配置环境变量

编辑 `app/.env.server`：

```bash
YOUR_NEW_PROVIDER_API_KEY=your_api_key_here
```

### 步骤 5: 配置积分费用

编辑 [`app/src/payment/creditPricing.ts`](app/src/payment/creditPricing.ts)：

```typescript
export const modelCreditCosts: ModelCreditCost = {
  // ... 现有配置 ...
  your_new_provider: {
    'your-model-1': 0.10,
    'your-model-2': 0.25,
  },
};
```

---

## 🧪 测试 AI API

### 1. 测试文本生成

创建测试文件 `app/src/demo-ai-app/test-ai.ts`：

```typescript
import { chatCompletion } from './aiProvider';

async function testChatCompletion() {
  try {
    console.log('Testing chat completion...\n');

    const result = await chatCompletion(
      [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say "Hello, World!" in 5 different languages.' }
      ],
      'google/gemini-2.5-flash'
    );

    console.log('✅ Success!');
    console.log('Provider:', result.provider);
    console.log('Model:', result.model);
    console.log('Response:', result.text);
    console.log('Tokens:', `${result.promptTokens} prompt + ${result.completionTokens} completion`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testChatCompletion();
```

运行测试：

```bash
cd app
npx tsx src/demo-ai-app/test-ai.ts
```

### 2. 测试故障转移

禁用 Nano API 测试 OpenRouter 备用：

```bash
# 临时移除 Nano API Key
export NANO_API_KEY=""

# 运行测试（应该自动切换到 OpenRouter）
npx tsx src/demo-ai-app/test-ai.ts
```

---

## 📊 监控和日志

### 查看 AI API 调用日志

在 `operations.ts` 中已添加详细日志：

```typescript
console.log('[AI Request] Provider:', result.provider);
console.log('[AI Request] Model:', result.model);
console.log('[AI Request] Tokens:', result.promptTokens, '+', result.completionTokens);
```

### 查看积分扣除日志

```typescript
console.log('[Credit Deduction] User:', context.user.id);
console.log('[Credit Deduction] Model:', result.model);
console.log('[Credit Deduction] Cost:', creditCost);
console.log('[Credit Deduction] Remaining:', updatedUser.credits);
```

### 检查 Wasp 服务器日志

```bash
# 开发环境
wasp start  # 查看终端输出

# 生产环境
docker logs wasp-server -f
```

---

## 🔧 常见问题

### 1. API 调用失败: "No enabled providers found"

**原因:** 没有配置任何 API Key

**解决方案:**
```bash
# 检查 .env.server
cat app/.env.server | grep API_KEY

# 至少配置一个 API Key
NANO_API_KEY=your_key_here
```

### 2. 模型不支持: "No provider found for model"

**原因:** 没有提供商支持该模型

**解决方案:**
- 检查 `apiProviders.ts` 中的 `supportedModels`
- 或添加 `modelMapping` 映射

### 3. 积分未扣除

**原因:** 模型名称在 `creditPricing.ts` 中找不到

**解决方案:**
```typescript
// 确保 creditPricing.ts 中有对应的配置
export const modelCreditCosts = {
  nano_api: {
    'gemini-2.5-flash-image': 0.08, // ← 检查这里
  },
};
```

### 4. 超时错误

**原因:** AI API 响应时间过长

**解决方案:**
```typescript
// 调整 timeout 配置（apiProviders.ts）
{
  id: 'nano_api',
  timeout: 600000, // 改为 10 分钟
}
```

---

## 📚 相关文档

- [积分系统文档](CREDIT_SYSTEM.md)
- [Stripe 支付配置](STRIPE_SETUP.md)
- [功能配置系统](FEATURES_CONFIG.md)
- [架构设计](ARCHITECTURE.md)

---

## ✅ API 集成检查清单

- [x] 配置至少一个 API 提供商（Nano API 或 OpenRouter）
- [x] 在 `.env.server` 中设置 API Keys
- [x] 配置模型积分费用（`creditPricing.ts`）
- [x] 实现业务逻辑（`operations.ts`）
- [ ] 测试 chatCompletion 功能
- [ ] 测试 imageGeneration 功能
- [ ] 测试故障转移机制
- [ ] 测试积分扣除逻辑
- [ ] 在生产环境验证

---

**🎉 现在你已经掌握了 Nano Banana Magic 的 AI API 集成方式！**

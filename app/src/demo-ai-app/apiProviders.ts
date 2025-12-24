/**
 * API提供商配置
 * 支持多个AI API来源的统一配置管理
 */

export type ApiProviderType = 'openrouter' | 'nano_api';

export interface ApiProviderConfig {
  /** 提供商唯一标识 */
  id: ApiProviderType;
  /** 显示名称 */
  name: string;
  /** API密钥环境变量名 */
  apiKeyEnv: string;
  /** API基础URL */
  baseUrl: string;
  /** 是否启用 */
  enabled: boolean;
  /** 优先级（数字越小优先级越高） */
  priority: number;
  /** 支持的模型列表（为空表示支持所有模型） */
  supportedModels?: string[];
  /** 模型映射（将通用模型名映射到提供商特定的模型名） */
  modelMapping?: Record<string, string>;
  /** 额外的请求头 */
  headers?: Record<string, string>;
  /** 超时时间（毫秒） */
  timeout?: number;
}

/**
 * API提供商配置列表
 * 按priority排序，系统会依次尝试可用的提供商
 */
export const API_PROVIDERS: ApiProviderConfig[] = [
  {
    id: 'nano_api',
    name: 'Nano Banana API',
    apiKeyEnv: 'NANO_API_KEY',
    baseUrl: process.env.NANO_API_BASE_URL || 'https://api.naga.ac/v1',
    enabled: true,
    priority: 1, // 最高优先级
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
    timeout: 300000 // 5分钟
  },
];

/**
 * 获取当前启用的API提供商（按优先级排序）
 */
export function getEnabledProviders(): ApiProviderConfig[] {
  return API_PROVIDERS
    .filter(provider => provider.enabled)
    .filter(provider => {
      // 检查API密钥是否存在
      const apiKey = process.env[provider.apiKeyEnv];
      return apiKey && apiKey.trim().length > 0;
    })
    .sort((a, b) => a.priority - b.priority);
}

/**
 * 根据模型名获取支持该模型的提供商
 */
export function getProviderForModel(modelName: string): ApiProviderConfig | null {
  const enabledProviders = getEnabledProviders();

  for (const provider of enabledProviders) {
    // 如果提供商没有指定支持的模型列表，表示支持所有模型
    if (!provider.supportedModels || provider.supportedModels.length === 0) {
      return provider;
    }

    // 检查是否在支持的模型列表中
    if (provider.supportedModels.includes(modelName)) {
      return provider;
    }

    // 检查是否有模型映射
    if (provider.modelMapping && provider.modelMapping[modelName]) {
      return provider;
    }
  }

  return null;
}

/**
 * 获取提供商特定的模型名
 * 如果有映射则返回映射后的名称，否则返回原名称
 */
export function getMappedModelName(provider: ApiProviderConfig, modelName: string): string {
  if (provider.modelMapping && provider.modelMapping[modelName]) {
    return provider.modelMapping[modelName];
  }
  return modelName;
}

/**
 * 获取API密钥
 */
export function getApiKey(provider: ApiProviderConfig): string | null {
  const apiKey = process.env[provider.apiKeyEnv];
  return apiKey ? apiKey.trim() : null;
}

/**
 * 获取默认提供商（优先级最高的可用提供商）
 */
export function getDefaultProvider(): ApiProviderConfig | null {
  const enabledProviders = getEnabledProviders();
  return enabledProviders.length > 0 ? enabledProviders[0] : null;
}

/**
 * 根据ID获取提供商配置
 */
export function getProviderById(id: ApiProviderType | string): ApiProviderConfig | null {
  return API_PROVIDERS.find(p => p.id === id) || null;
}

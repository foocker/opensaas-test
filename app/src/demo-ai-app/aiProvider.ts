/**
 * AI Provider Abstraction Layer
 * 统一处理 OpenRouter 和 Nano API 的调用接口
 */

import type { ApiProviderConfig } from "./apiProviders";
import {
  getEnabledProviders,
  getMappedModelName,
  getApiKey,
  getProviderById,
} from "./apiProviders";

// Chat completion 请求参数
export interface ChatCompletionRequest {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// Chat completion 响应
export interface ChatCompletionResponse {
  text: string;
  promptTokens: number;
  completionTokens: number;
  model: string;
  provider: string;
}

/**
 * OpenRouter Provider
 * Uses OpenAI-compatible /chat/completions API
 */
class OpenRouterProvider {
  private config: ApiProviderConfig;
  private apiKey: string;

  constructor(config: ApiProviderConfig, apiKey: string) {
    this.config = config;
    this.apiKey = apiKey;
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const modelName = getMappedModelName(this.config, request.model);

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        ...(this.config.headers || {}),
      },
      body: JSON.stringify({
        model: modelName,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4096,
      }),
      signal: AbortSignal.timeout(this.config.timeout || 300000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      text: data.choices[0]?.message?.content || "",
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      model: data.model || modelName,
      provider: this.config.id,
    };
  }
}

/**
 * Nano API Provider
 * Uses OpenAI-compatible /chat/completions API
 */
class NanoApiProvider {
  private config: ApiProviderConfig;
  private apiKey: string;

  constructor(config: ApiProviderConfig, apiKey: string) {
    this.config = config;
    this.apiKey = apiKey;
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const modelName = getMappedModelName(this.config, request.model);

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4096,
      }),
      signal: AbortSignal.timeout(this.config.timeout || 300000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Nano API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      text: data.choices[0]?.message?.content || "",
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      model: data.model || modelName,
      provider: this.config.id,
    };
  }
}

/**
 * 创建提供商实例
 */
function createProvider(
  config: ApiProviderConfig,
  apiKey: string
): OpenRouterProvider | NanoApiProvider {
  switch (config.id) {
    case "nano_api":
      return new NanoApiProvider(config, apiKey);
    case "openrouter":
      return new OpenRouterProvider(config, apiKey);
    default:
      throw new Error(`Unknown provider: ${config.id}`);
  }
}

/**
 * 统一的 Chat Completion 接口
 * 自动选择可用的提供商
 */
export async function chatCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  model: string = "google/gemini-2.0-flash-exp",
  temperature: number = 0.7,
  maxTokens: number = 4096
): Promise<ChatCompletionResponse> {
  const enabledProviders = getEnabledProviders();

  if (enabledProviders.length === 0) {
    throw new Error(
      "No AI provider available. Please configure OPENROUTER_API_KEY or NANO_API_KEY in .env.server"
    );
  }

  let lastError: Error | null = null;

  for (const providerConfig of enabledProviders) {
    try {
      const apiKey = getApiKey(providerConfig);
      if (!apiKey) {
        console.warn(`[AI Provider] Skipping ${providerConfig.name}: No API key found`);
        continue;
      }

      console.log(`[AI Provider] Trying ${providerConfig.name} (priority ${providerConfig.priority})...`);

      const provider = createProvider(providerConfig, apiKey);
      const response = await provider.chatCompletion({
        messages,
        model,
        temperature,
        maxTokens,
      });

      console.log(`[AI Provider] ✓ Success with ${response.provider} (model: ${response.model})`);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[AI Provider] ✗ Failed with ${providerConfig.name}:`, errorMessage);
      lastError = error instanceof Error ? error : new Error(errorMessage);
      continue;
    }
  }

  throw lastError || new Error("All AI providers failed");
}

/**
 * 使用指定提供商
 */
export async function chatCompletionWithProvider(
  providerId: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  model: string = "google/gemini-2.0-flash-exp",
  temperature: number = 0.7,
  maxTokens: number = 4096
): Promise<ChatCompletionResponse> {
  const providerConfig = getProviderById(providerId as any);
  if (!providerConfig) {
    throw new Error(`Provider not found: ${providerId}`);
  }

  if (!providerConfig.enabled) {
    throw new Error(`Provider is disabled: ${providerId}`);
  }

  const apiKey = getApiKey(providerConfig);
  if (!apiKey) {
    throw new Error(`API key not found for provider: ${providerConfig.name}`);
  }

  const provider = createProvider(providerConfig, apiKey);
  return provider.chatCompletion({
    messages,
    model,
    temperature,
    maxTokens,
  });
}

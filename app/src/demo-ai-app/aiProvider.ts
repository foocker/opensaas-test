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

// Image generation 请求参数
export interface ImageGenerationRequest {
  model: string;
  prompt: string;
  images?: string[]; // Base64 encoded images for multimodal input
  aspectRatio?: string; // e.g. "1:1", "16:9"
  outputSize?: string; // e.g. "1K", "2K", "4K"
}

// Image generation 响应
export interface ImageGenerationResponse {
  imageBase64: string; // Base64 encoded image
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
 * Uses Gemini-compatible API format (not OpenAI format)
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

    // 构建 Gemini 格式的 parts
    const parts: Array<any> = [];

    for (const message of request.messages) {
      parts.push({ text: message.content });
    }

    // 构建 Gemini 格式的请求体
    const requestBody = {
      contents: [{
        parts: parts
      }]
    };

    console.log('Nano API request:', {
      url: `${this.config.baseUrl}/v1beta/models/${modelName}:generateContent`,
      model: modelName
    });

    // 使用 Gemini 格式: /v1beta/models/{model}:generateContent?key={apiKey}
    const url = `${this.config.baseUrl}/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.config.timeout || 300000),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Nano API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    console.log('Nano API response:', {
      hasCandidates: !!data.candidates?.length,
      hasParts: !!data.candidates?.[0]?.content?.parts?.length
    });

    // 提取 Gemini 格式的响应
    let responseText = "No response generated.";
    const usageMetadata = data.usageMetadata || {};

    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            responseText = part.text;
            break;
          }
        }
      }
    }

    return {
      text: responseText,
      promptTokens: usageMetadata.promptTokenCount || 0,
      completionTokens: usageMetadata.candidatesTokenCount || 0,
      model: modelName,
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

/**
 * 图像生成接口
 * 使用 Gemini 图像生成模型（通过 chat/completions API）
 */
export async function imageGeneration(
  request: ImageGenerationRequest
): Promise<ImageGenerationResponse> {
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

      console.log(`[AI Provider] Trying image generation with ${providerConfig.name}...`);

      const modelName = getMappedModelName(providerConfig, request.model);

      // Nano API 使用 Gemini 格式
      if (providerConfig.id === 'nano_api') {
        // 构建 Gemini 格式的 parts
        const parts: any[] = [{ text: request.prompt }];

        // 添加图片（如果有）
        if (request.images && request.images.length > 0) {
          for (const imageData of request.images) {
            if (imageData.startsWith('data:image/')) {
              const [mimeType, base64Data] = imageData.split(',');
              const mime = mimeType.match(/data:(.*?);/)?.[1] || 'image/jpeg';
              parts.push({
                inline_data: {
                  mime_type: mime,
                  data: base64Data
                }
              });
            }
          }
        }

        // 构建 Gemini 格式的请求体
        const requestBody: any = {
          contents: [{ parts }]
        };

        // 添加图片生成配置
        if (request.model.includes('image')) {
          const imageConfig: any = {};
          if (request.aspectRatio) {
            imageConfig.aspectRatio = request.aspectRatio;
          }
          if (request.outputSize) {
            imageConfig.imageSize = request.outputSize;
          }
          requestBody.generationConfig = {
            responseModalities: ['TEXT', 'IMAGE'],
            ...(Object.keys(imageConfig).length > 0 && { imageConfig })
          };
        }

        const url = `${providerConfig.baseUrl}/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(providerConfig.timeout || 300000),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Nano API error: ${response.status} - ${error}`);
        }

        const data = await response.json();

        // 提取图片数据
        let imageBase64 = "";
        const usageMetadata = data.usageMetadata || {};

        if (data.candidates && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          if (candidate.content?.parts) {
            for (const part of candidate.content.parts) {
              // 检查 inline_data 中的图片
              if (part.inline_data || part.inlineData) {
                const inlineData = part.inline_data || part.inlineData;
                const { mime_type, mimeType, data: imageData } = inlineData;
                const mime = mime_type || mimeType;
                imageBase64 = `data:${mime};base64,${imageData}`;
                break;
              }
            }
          }
        }

        if (!imageBase64) {
          throw new Error("No image data found in Nano API response");
        }

        console.log(`[AI Provider] ✓ Image generated successfully with ${providerConfig.name}`);

        return {
          imageBase64,
          promptTokens: usageMetadata.promptTokenCount || 0,
          completionTokens: usageMetadata.candidatesTokenCount || 0,
          model: modelName,
          provider: providerConfig.id,
        };
      }

      // OpenRouter 使用 OpenAI 格式
      else {
        const content: any[] = [{ type: "text", text: request.prompt }];

        // 添加图片（如果有）
        if (request.images && request.images.length > 0) {
          for (const imageData of request.images) {
            content.push({
              type: "image_url",
              image_url: { url: imageData }
            });
          }
        }

        const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            ...(providerConfig.headers || {}),
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "user",
                content: content
              }
            ],
            temperature: 1.0,
            max_tokens: 8192,
          }),
          signal: AbortSignal.timeout(providerConfig.timeout || 300000),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`API error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const messageContent = data.choices[0]?.message?.content || "";

        // 从 markdown 格式中提取 base64 图片
        const imageMatch = messageContent.match(/!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/);
        if (!imageMatch) {
          throw new Error("No image data found in response");
        }

        const imageBase64 = imageMatch[1];

        console.log(`[AI Provider] ✓ Image generated successfully with ${providerConfig.name}`);

        return {
          imageBase64,
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          model: data.model || modelName,
          provider: providerConfig.id,
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[AI Provider] ✗ Image generation failed with ${providerConfig.name}:`, errorMessage);
      lastError = error instanceof Error ? error : new Error(errorMessage);
      continue;
    }
  }

  throw lastError || new Error("All AI providers failed for image generation");
}

/**
 * AI Provider Abstraction Layer
 * Supports OpenRouter and Nano API with OpenAI-compatible interfaces
 */

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  text: string;
  promptTokens: number;
  completionTokens: number;
  model: string;
  provider: string;
}

interface AIProviderConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
}

/**
 * OpenRouter Provider
 * Uses OpenAI-compatible chat completions API
 */
class OpenRouterProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async chatCompletion(
    messages: ChatMessage[],
    model: string = "google/gemini-2.0-flash-001",
    temperature: number = 0.7,
    maxTokens: number = 4096
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
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
      model: data.model || model,
      provider: this.config.id,
    };
  }
}

/**
 * Nano API Provider
 * Uses OpenAI-compatible chat completions API
 */
class NanoApiProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async chatCompletion(
    messages: ChatMessage[],
    model: string = "google/gemini-2.0-flash-001",
    temperature: number = 0.7,
    maxTokens: number = 4096
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
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
      model: data.model || model,
      provider: this.config.id,
    };
  }
}

/**
 * Get available AI provider
 * Priority: OpenRouter > Nano API
 */
export function getAIProvider(): OpenRouterProvider | NanoApiProvider | null {
  // Try OpenRouter first
  if (process.env.OPENROUTER_API_KEY) {
    return new OpenRouterProvider({
      id: "openrouter",
      name: "OpenRouter",
      baseUrl: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }

  // Fallback to Nano API
  if (process.env.NANO_API_KEY && process.env.NANO_API_BASE_URL) {
    return new NanoApiProvider({
      id: "nano_api",
      name: "Nano API",
      baseUrl: process.env.NANO_API_BASE_URL,
      apiKey: process.env.NANO_API_KEY,
    });
  }

  return null;
}

/**
 * Chat completion wrapper
 * Automatically selects available provider
 */
export async function chatCompletion(
  messages: ChatMessage[],
  model: string = "google/gemini-2.0-flash-001",
  temperature: number = 0.7,
  maxTokens: number = 4096
): Promise<ChatCompletionResponse> {
  const provider = getAIProvider();

  if (!provider) {
    throw new Error(
      "No AI provider configured. Please set OPENROUTER_API_KEY or NANO_API_KEY in .env.server"
    );
  }

  return provider.chatCompletion(messages, model, temperature, maxTokens);
}

export type { ChatMessage, ChatCompletionResponse };

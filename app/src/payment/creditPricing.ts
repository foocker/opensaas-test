/**
 * Credit Pricing Configuration
 *
 * This file defines the credit costs for different AI models and providers.
 * This is decoupled from the credit recharging system (plans.ts).
 *
 * Design principle: Credit recharging and credit deduction are separate concerns.
 * - Recharging: How users buy credits (configured in plans.ts + Stripe Dashboard)
 * - Deduction: How credits are consumed per API call (configured here)
 */

export interface ModelCreditCost {
  [providerId: string]: {
    [modelId: string]: number;
  };
}

/**
 * Credit costs per API call for each provider and model.
 *
 * Current pricing (nano_api only):
 * - flash model: 0.08 credits per call
 * - pro model: 0.35 credits per call
 *
 * Other providers can be added here as needed.
 */
export const modelCreditCosts: ModelCreditCost = {
  nano_api: {
    'gemini-2.5-flash-image': 0.08,
    'gemini-3-pro-image-preview': 0.35,
  },
  // Future: openrouter, grsai can be added here
  // openrouter: {
  //   'model-id': 0.10,
  // },
};

/**
 * Get the credit cost for a specific provider and model.
 *
 * @param providerId - The provider ID (e.g., 'nano_api')
 * @param modelId - The model ID (e.g., 'gemini-2.5-flash-image')
 * @returns The credit cost, or 0 if not found (free tier or unconfigured)
 */
export function getModelCreditCost(providerId: string, modelId: string): number {
  const providerCosts = modelCreditCosts[providerId];
  if (!providerCosts) {
    return 0; // Provider not configured = free
  }

  const cost = providerCosts[modelId];
  return cost ?? 0; // Model not configured = free
}

/**
 * Check if user has enough credits for a specific model call.
 *
 * @param userCredits - Current user credit balance
 * @param providerId - The provider ID
 * @param modelId - The model ID
 * @returns true if user has enough credits
 */
export function hasEnoughCredits(
  userCredits: number,
  providerId: string,
  modelId: string
): boolean {
  const cost = getModelCreditCost(providerId, modelId);
  return userCredits >= cost;
}

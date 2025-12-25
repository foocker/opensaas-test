import { requireNodeEnvVar } from "../server/utils";

export enum SubscriptionStatus {
  PastDue = "past_due",
  CancelAtPeriodEnd = "cancel_at_period_end",
  Active = "active",
  Deleted = "deleted",
}

export enum PaymentPlanId {
  Hobby = "hobby",
  Pro = "pro",
  Credits10 = "credits10",
  Credits50 = "credits50",
  Credits100 = "credits100",
  Credits200 = "credits200",
}

export interface PaymentPlan {
  /**
   * Returns the id under which this payment plan is identified on your payment processor.
   *
   * E.g. price id on Stripe, or variant id on LemonSqueezy.
   */
  getPaymentProcessorPlanId: () => string;
  effect: PaymentPlanEffect;
}

export type PaymentPlanEffect =
  | { kind: "subscription" }
  | { kind: "credits"; amount: number };

export const paymentPlans = {
  [PaymentPlanId.Hobby]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_HOBBY_SUBSCRIPTION_PLAN_ID"),
    effect: { kind: "subscription" },
  },
  [PaymentPlanId.Pro]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_PRO_SUBSCRIPTION_PLAN_ID"),
    effect: { kind: "subscription" },
  },
  [PaymentPlanId.Credits10]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_CREDITS_10_PLAN_ID"),
    effect: { kind: "credits", amount: 10 },
  },
  [PaymentPlanId.Credits50]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_CREDITS_50_PLAN_ID"),
    effect: { kind: "credits", amount: 55 }, // 50元充值，赠送10%
  },
  [PaymentPlanId.Credits100]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_CREDITS_100_PLAN_ID"),
    effect: { kind: "credits", amount: 115 }, // 100元充值，赠送15%
  },
  [PaymentPlanId.Credits200]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar("PAYMENTS_CREDITS_200_PLAN_ID"),
    effect: { kind: "credits", amount: 240 }, // 200元充值，赠送20%
  },
} as const satisfies Record<PaymentPlanId, PaymentPlan>;

export function prettyPaymentPlanName(planId: PaymentPlanId): string {
  const planToName: Record<PaymentPlanId, string> = {
    [PaymentPlanId.Hobby]: "Hobby",
    [PaymentPlanId.Pro]: "Pro",
    [PaymentPlanId.Credits10]: "10 Credits",
    [PaymentPlanId.Credits50]: "55 Credits",
    [PaymentPlanId.Credits100]: "115 Credits",
    [PaymentPlanId.Credits200]: "240 Credits",
  };
  return planToName[planId];
}

export function parsePaymentPlanId(planId: string): PaymentPlanId {
  if ((Object.values(PaymentPlanId) as string[]).includes(planId)) {
    return planId as PaymentPlanId;
  } else {
    throw new Error(`Invalid PaymentPlanId: ${planId}`);
  }
}

export function getSubscriptionPaymentPlanIds(): PaymentPlanId[] {
  return Object.values(PaymentPlanId).filter(
    (planId) => paymentPlans[planId].effect.kind === "subscription",
  );
}

/**
 * Returns Open SaaS `PaymentPlanId` for some payment provider's plan ID.
 * 
 * Different payment providers track plan ID in different ways.
 * e.g. Stripe price ID, Polar product ID...
 */
export function getPaymentPlanIdByPaymentProcessorPlanId(
  paymentProcessorPlanId: string,
): PaymentPlanId {
  for (const [planId, plan] of Object.entries(paymentPlans)) {
    if (plan.getPaymentProcessorPlanId() === paymentProcessorPlanId) {
      return planId as PaymentPlanId;
    }
  }

  throw new Error(
    `Unknown payment processor plan ID: ${paymentProcessorPlanId}`,
  );
}

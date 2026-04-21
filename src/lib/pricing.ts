export const PLANS = {
  STANDARD: {
    name: "Free",
    tier: "STANDARD" as const,
    monthlyGbp: 0,
    priceLabel: "£0/month",
    stripePriceId: null,
    referralQuota: 0,
    features: [
      "No login or registration required",
      "Access all referral links",
      "Cannot publish referral links",
      "Browse community offers for free",
    ],
  },
  STARTER: {
    name: "Standard",
    tier: "STARTER" as const,
    monthlyGbp: 0.99,
    priceLabel: "£0.99/month",
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID ?? process.env.STRIPE_BASIC_PRICE_ID ?? "",
    referralQuota: 3,
    features: [
      "Access all referral links",
      "Share up to 3 referrals per year",
      "+1 yearly referral bonus",
      "Community support",
      "Create a profile and manage your links",
    ],
  },
  PREMIUM: {
    name: "Pro",
    tier: "PREMIUM" as const,
    monthlyGbp: 4.99,
    priceLabel: "£4.99/month",
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID ?? "",
    referralQuota: 20,
    features: [
      "Access all referral links",
      "Share up to 20 referrals per year",
      "+2 yearly referral bonus",
      "Priority community support",
      "Join the waitlist for featured referral placement",
      "Enhanced profile visibility",
    ],
  },
} as const;

export type PlanTier = keyof typeof PLANS;

// URL-friendly slugs used in ?plan= params — keeps URLs readable
// "standard" maps to the STARTER DB tier, "pro" maps to PREMIUM
export const PLAN_SLUG_TO_TIER = {
  standard: "STARTER",
  pro: "PREMIUM",
} as const;

export type PlanSlug = keyof typeof PLAN_SLUG_TO_TIER;

export const PLAN_TIER_TO_SLUG: Record<string, PlanSlug> = {
  STARTER: "standard",
  PREMIUM: "pro",
};

export const PLAN_MONTHLY_COST: Record<string, number> = {
  STANDARD: 0,
  STARTER: 0.99,
  PREMIUM: 4.99,
};

// Legacy — keep for any code that imports these
export const PRICING = {
  STANDARD: { monthlyGbp: 0, label: "Free" },
  STARTER:  { monthlyGbp: 0.99, label: "Standard" },
  PREMIUM:  { monthlyGbp: 4.99, label: "Pro" },
} as const;

export const BRAND_REQUEST_QUOTA = {
  STANDARD: 0,
  STARTER: 3,
  PREMIUM: 20,
} as const;

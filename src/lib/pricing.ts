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

// ── Slot limits (total concurrent active + pending referral slots) ─────────
// Statuses that consume a slot: PENDING, APPROVED
// Statuses that do NOT consume a slot: REJECTED
export const SLOT_LIMIT: Record<string, number> = {
  STANDARD: 0,
  STARTER: 3,
  PREMIUM: 20,
};

// ── Validity periods (months from publishedAt/approval date) ──────────────
// STANDARD users cannot publish, so no entry needed
export const VALIDITY_MONTHS: Record<string, number> = {
  STARTER: 3,
  PREMIUM: 12,
};

// Days before expiry at which we show the "Expiring Soon" warning badge
export const EXPIRY_WARNING_DAYS = 30;

// ── Expiry helpers ────────────────────────────────────────────────────────

/** Calculate expiry date for a published link based on plan at time of publish */
export function getExpiryDate(publishedAt: Date, planAtPublish: string): Date {
  const months = VALIDITY_MONTHS[planAtPublish] ?? 3;
  const expiry = new Date(publishedAt);
  expiry.setMonth(expiry.getMonth() + months);
  return expiry;
}

export type ExpiryStatus = "active" | "expiring-soon" | "expired";

/** Determine the expiry status badge for a published link */
export function getExpiryStatus(expiryDate: Date): ExpiryStatus {
  const now = new Date();
  const msUntilExpiry = expiryDate.getTime() - now.getTime();
  const daysUntilExpiry = msUntilExpiry / (1000 * 60 * 60 * 24);
  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= EXPIRY_WARNING_DAYS) return "expiring-soon";
  return "active";
}

/** Count slots consumed by a user (PENDING + APPROVED submissions + PENDING brand requests) */
export function countSlotsUsed(pendingSubmissions: number, approvedSubmissions: number, pendingBrandRequests: number): number {
  return pendingSubmissions + approvedSubmissions + pendingBrandRequests;
}

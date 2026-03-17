export const PRICING = {
  STANDARD: { monthlyGbp: 3, label: "Standard" },
  PREMIUM: { monthlyGbp: 7, label: "Premium" },
} as const;

export const BRAND_REQUEST_QUOTA = {
  STANDARD: 1,
  PREMIUM: 10,
} as const;

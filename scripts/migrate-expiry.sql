-- Add publishedAt and planAtPublish to Link
ALTER TABLE "Link" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
ALTER TABLE "Link" ADD COLUMN IF NOT EXISTS "planAtPublish" "MembershipTier";

-- Index for expiry queries
CREATE INDEX IF NOT EXISTS "Link_publishedAt_idx" ON "Link"("publishedAt");

-- Unique constraint on BrandRequest to prevent duplicate requests
ALTER TABLE "BrandRequest" DROP CONSTRAINT IF EXISTS "BrandRequest_userId_brandName_categoryId_key";
ALTER TABLE "BrandRequest" ADD CONSTRAINT "BrandRequest_userId_brandName_categoryId_key" UNIQUE ("userId", "brandName", "categoryId");

-- Index on brandName for waitlist demand lookups
CREATE INDEX IF NOT EXISTS "BrandRequest_brandName_idx" ON "BrandRequest"("brandName");

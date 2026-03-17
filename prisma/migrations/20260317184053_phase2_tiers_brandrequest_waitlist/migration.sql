/*
  Warnings:

  - The values [FREE,BASIC] on the enum `MembershipTier` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reason` on the `Report` table. All the data in the column will be lost.
  - You are about to alter the column `note` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - Made the column `note` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BrandRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "MembershipTier_new" AS ENUM ('STANDARD', 'PREMIUM');
ALTER TABLE "User" ALTER COLUMN "membershipTier" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "membershipTier" TYPE "MembershipTier_new" USING (
  CASE "membershipTier"::text
    WHEN 'PREMIUM' THEN 'PREMIUM'::"MembershipTier_new"
    ELSE 'STANDARD'::"MembershipTier_new"
  END
);
ALTER TYPE "MembershipTier" RENAME TO "MembershipTier_old";
ALTER TYPE "MembershipTier_new" RENAME TO "MembershipTier";
DROP TYPE "MembershipTier_old";
ALTER TABLE "User" ALTER COLUMN "membershipTier" SET DEFAULT 'STANDARD';
COMMIT;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reason",
ALTER COLUMN "note" SET NOT NULL,
ALTER COLUMN "note" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "membershipTier" SET DEFAULT 'STANDARD';

-- DropEnum
DROP TYPE "ReportReason";

-- CreateTable
CREATE TABLE "BrandRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "note" TEXT,
    "status" "BrandRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BrandRequest_userId_idx" ON "BrandRequest"("userId");

-- CreateIndex
CREATE INDEX "BrandRequest_categoryId_idx" ON "BrandRequest"("categoryId");

-- CreateIndex
CREATE INDEX "WaitlistEntry_linkId_position_idx" ON "WaitlistEntry"("linkId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_userId_linkId_key" ON "WaitlistEntry"("userId", "linkId");

-- AddForeignKey
ALTER TABLE "BrandRequest" ADD CONSTRAINT "BrandRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandRequest" ADD CONSTRAINT "BrandRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

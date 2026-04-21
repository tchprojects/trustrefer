/**
 * One-time migration: create Subscription records for existing paid users
 * who were upgraded manually (no Stripe checkout flow).
 *
 * Sets currentPeriodEnd = 30 days from today, status = ACTIVE.
 *
 * Run once with:
 *   npx tsx scripts/fix-subscriptions.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const paidUsers = await prisma.user.findMany({
    where: { membershipTier: { not: "STANDARD" } },
    include: { subscription: true },
  });

  console.log(`Found ${paidUsers.length} paid user(s).`);

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 days

  let created = 0;
  let skipped = 0;

  for (const user of paidUsers) {
    if (user.subscription) {
      // Already has a record — just ensure currentPeriodEnd is set
      if (!user.subscription.currentPeriodEnd) {
        await prisma.subscription.update({
          where: { userId: user.id },
          data: { currentPeriodEnd: periodEnd, status: "ACTIVE" },
        });
        console.log(`  Updated subscription for ${user.email}`);
        created++;
      } else {
        console.log(`  Skipped ${user.email} — already has subscription`);
        skipped++;
      }
    } else {
      // No subscription record — create one
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: "ACTIVE",
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        },
      });
      console.log(`  Created subscription for ${user.email} (${user.membershipTier})`);
      created++;
    }
  }

  console.log(`\nDone. Created/updated: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

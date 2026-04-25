/**
 * Merges legacy categories into their renamed counterparts:
 *   Home & Bills  (slug: home-bills)  → Energy    (slug: energy,     order: 2)
 *   Tech & Mobile (slug: tech-mobile) → Broadband (slug: broadband,  order: 3)
 *
 * Strategy per pair:
 *   1. Ensure the target category exists (upsert with correct name/order).
 *   2. Move all links from the source category to the target.
 *   3. Move all brand requests from the source category to the target.
 *   4. Delete the source category.
 *
 * Safe to run multiple times (idempotent).
 * Run with:  npx tsx scripts/rename-categories.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MERGES = [
  { srcSlug: "home-bills",  dstSlug: "energy",    dstName: "Energy",    order: 2 },
  { srcSlug: "tech-mobile", dstSlug: "broadband", dstName: "Broadband", order: 3 },
];

function log(msg: string) { console.log(`  ${msg}`); }

async function main() {
  console.log("Category merge/rename starting…\n");

  for (const { srcSlug, dstSlug, dstName, order } of MERGES) {
    console.log(`── ${srcSlug} → ${dstSlug} ──`);

    // 1. Ensure destination exists with correct name and order
    const dst = await prisma.category.upsert({
      where:  { slug: dstSlug },
      update: { name: dstName, order, isActive: true },
      create: { name: dstName, slug: dstSlug, order, isActive: true },
    });
    log(`target: id=${dst.id}  name="${dst.name}"  order=${dst.order}`);

    // 2. Find source category
    const src = await prisma.category.findUnique({ where: { slug: srcSlug } });
    if (!src) {
      log(`source "${srcSlug}" not found — already migrated, skipping`);
      continue;
    }
    log(`source: id=${src.id}  name="${src.name}"`);

    // 3. Move links
    const links = await prisma.link.updateMany({
      where: { categoryId: src.id },
      data:  { categoryId: dst.id },
    });
    log(`moved ${links.count} link(s)`);

    // 4. Move brand requests (deduplicate first to avoid unique constraint violations)
    const requests = await prisma.brandRequest.findMany({
      where: { categoryId: src.id },
    });

    let movedReqs = 0;
    let deletedDups = 0;

    for (const req of requests) {
      const conflict = await prisma.brandRequest.findFirst({
        where: {
          userId:     req.userId,
          brandName:  req.brandName,
          categoryId: dst.id,
        },
      });
      if (conflict) {
        await prisma.brandRequest.delete({ where: { id: req.id } });
        deletedDups++;
      } else {
        await prisma.brandRequest.update({
          where: { id: req.id },
          data:  { categoryId: dst.id },
        });
        movedReqs++;
      }
    }
    log(`moved ${movedReqs} brand request(s), deleted ${deletedDups} duplicate(s)`);

    // 5. Delete source category
    await prisma.category.delete({ where: { id: src.id } });
    log(`deleted source category "${srcSlug}"`);

    console.log();
  }

  // Print final list
  const final = await prisma.category.findMany({ orderBy: { order: "asc" } });
  console.log("Final categories:");
  for (const c of final) {
    console.log(`  [${String(c.order).padStart(2)}] ${c.name.padEnd(22)} slug=${c.slug}`);
  }

  console.log("\n✅  Done.");
}

main()
  .catch((e) => { console.error("\n❌  Failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());

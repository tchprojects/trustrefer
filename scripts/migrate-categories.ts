/**
 * Category taxonomy migration script
 *
 * Migrates the DB from 15 old categories to the new 11-category taxonomy:
 *   Money | Home & Bills | Tech & Mobile | Travel | Food & Drink
 *   Shopping & Rewards | Wellbeing | Motoring | Miscellaneous | Business Tools | Lifestyle
 *
 * Safe to run multiple times (idempotent).
 * Run with:  npx tsx scripts/migrate-categories.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── New taxonomy ─────────────────────────────────────────────────────────────

const NEW_CATEGORIES = [
  { name: "Money",             slug: "money",             order: 1 },
  { name: "Home & Bills",      slug: "home-bills",        order: 2 },
  { name: "Tech & Mobile",     slug: "tech-mobile",       order: 3 },
  { name: "Travel",            slug: "travel",            order: 4 }, // rename+reorder only
  { name: "Food & Drink",      slug: "food-drink",        order: 5 },
  { name: "Shopping & Rewards",slug: "shopping-rewards",  order: 6 },
  { name: "Wellbeing",         slug: "wellbeing",         order: 7 },
  { name: "Motoring",          slug: "motoring",          order: 8 },
  { name: "Miscellaneous",     slug: "miscellaneous",     order: 9 },  // kept as own category
  { name: "Business Tools",    slug: "business-tools",    order: 10 },
  { name: "Lifestyle",         slug: "lifestyle",         order: 11 },
];

// old slug → new slug
const SLUG_MAP: Record<string, string> = {
  banking:          "money",
  "investing-apps": "money",
  insurance:        "money",
  energy:           "home-bills",
  "solar-battery":  "home-bills",
  "home-services":  "home-bills",
  broadband:        "tech-mobile",
  mobile:           "tech-mobile",
  travel:           "travel",        // no data move needed, just order/name update
  "food-delivery":  "food-drink",
  "meal-kits":      "food-drink",
  dining:           "food-drink",
  cashback:         "shopping-rewards",
  "ev-car":         "motoring",
  miscellaneous:    "miscellaneous",  // kept — no data move, just order update
};

// Old slugs that are being replaced entirely (not just reordered)
const OLD_SLUGS_TO_DELETE = Object.keys(SLUG_MAP).filter(
  (s) => SLUG_MAP[s] !== s
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function log(msg: string) { console.log(`  ${msg}`); }
function section(title: string) { console.log(`\n── ${title} ──`); }

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🗂  Category taxonomy migration starting…\n");

  // ── 1. Upsert new categories ───────────────────────────────────────────────
  section("1 / 6  Upserting new categories");

  for (const cat of NEW_CATEGORIES) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, order: cat.order, isActive: true },
      create: { name: cat.name, slug: cat.slug, order: cat.order, isActive: true },
    });
    log(`✓ ${cat.name}  (${cat.slug}, order=${cat.order})`);
  }

  // ── 2. Build slug → id index for all categories ───────────────────────────
  section("2 / 6  Building slug → id index");

  const allCategories = await prisma.category.findMany();
  const slugToId: Record<string, string> = {};
  for (const c of allCategories) slugToId[c.slug] = c.id;

  // Verify every old slug and new slug is present
  for (const oldSlug of Object.keys(SLUG_MAP)) {
    if (!slugToId[oldSlug]) {
      log(`⚠  Old category not found in DB: "${oldSlug}" — may already be migrated`);
    }
  }
  for (const newSlug of [...new Set(Object.values(SLUG_MAP))]) {
    if (!slugToId[newSlug]) {
      throw new Error(`New category missing after upsert: "${newSlug}"`);
    }
  }
  log("Index built.");

  // ── 3. Remap Link.categoryId ──────────────────────────────────────────────
  section("3 / 6  Remapping links");

  for (const oldSlug of OLD_SLUGS_TO_DELETE) {
    const oldId = slugToId[oldSlug];
    if (!oldId) { log(`skip ${oldSlug} (not in DB)`); continue; }

    const newSlug = SLUG_MAP[oldSlug];
    const newId   = slugToId[newSlug];

    const result = await prisma.link.updateMany({
      where: { categoryId: oldId },
      data:  { categoryId: newId },
    });
    log(`links: ${oldSlug} → ${newSlug}  (${result.count} rows)`);
  }

  // ── 4. Deduplicate BrandRequests before remapping ─────────────────────────
  //
  // Multiple old categories can collapse into one new category
  // (e.g. "banking" + "investing-apps" both → "money").
  // If a user had brand requests for the same brand name in both old categories
  // the new unique constraint [userId, brandName, categoryId] would be violated.
  // Strategy: within each conflict group keep the OLDEST record, delete the rest.
  //
  section("4 / 6  Deduplicating brand requests");

  const allRequests = await prisma.brandRequest.findMany({
    orderBy: { createdAt: "asc" },
  });

  // Compute what new categoryId each request will land on
  const seen = new Map<string, string>(); // key → first request id (to keep)
  const toDelete: string[] = [];

  for (const req of allRequests) {
    const oldCat    = allCategories.find((c) => c.id === req.categoryId);
    const oldSlug   = oldCat?.slug ?? "";
    const newSlug   = SLUG_MAP[oldSlug] ?? oldSlug;
    const newCatId  = slugToId[newSlug] ?? req.categoryId;
    const key       = `${req.userId}||${req.brandName.toLowerCase()}||${newCatId}`;

    if (seen.has(key)) {
      toDelete.push(req.id);
      log(`duplicate: brand="${req.brandName}" old="${oldSlug}" → new="${newSlug}" — will delete id=${req.id}`);
    } else {
      seen.set(key, req.id);
    }
  }

  if (toDelete.length > 0) {
    await prisma.brandRequest.deleteMany({ where: { id: { in: toDelete } } });
    log(`Deleted ${toDelete.length} duplicate brand request(s).`);
  } else {
    log("No duplicates found.");
  }

  // ── 5. Remap BrandRequest.categoryId ─────────────────────────────────────
  section("5 / 6  Remapping brand requests");

  for (const oldSlug of OLD_SLUGS_TO_DELETE) {
    const oldId = slugToId[oldSlug];
    if (!oldId) { log(`skip ${oldSlug} (not in DB)`); continue; }

    const newSlug = SLUG_MAP[oldSlug];
    const newId   = slugToId[newSlug];

    const result = await prisma.brandRequest.updateMany({
      where: { categoryId: oldId },
      data:  { categoryId: newId },
    });
    log(`brand requests: ${oldSlug} → ${newSlug}  (${result.count} rows)`);
  }

  // ── 6. Delete old categories ──────────────────────────────────────────────
  section("6 / 6  Deleting old categories");

  for (const oldSlug of OLD_SLUGS_TO_DELETE) {
    const oldId = slugToId[oldSlug];
    if (!oldId) { log(`skip ${oldSlug} (not in DB)`); continue; }

    // Safety check: any orphaned rows?
    const linkCount = await prisma.link.count({ where: { categoryId: oldId } });
    const reqCount  = await prisma.brandRequest.count({ where: { categoryId: oldId } });

    if (linkCount > 0 || reqCount > 0) {
      log(`⚠  SKIPPED "${oldSlug}" — still has ${linkCount} link(s) and ${reqCount} brand request(s) referencing it!`);
      continue;
    }

    try {
      await prisma.category.delete({ where: { id: oldId } });
      log(`✓ deleted "${oldSlug}"`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`⚠  Could not delete "${oldSlug}": ${msg}`);
    }
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log("\n✅  Migration complete.\n");

  // Print final category list
  const final = await prisma.category.findMany({ orderBy: { order: "asc" } });
  console.log("Final categories:");
  for (const c of final) {
    console.log(`  [${c.order.toString().padStart(2)}] ${c.name.padEnd(20)} slug=${c.slug}`);
  }
}

main()
  .catch((e) => {
    console.error("\n❌  Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── New taxonomy (10 categories) ─────────────────────────────────────────────

const categories = [
  { name: "Money",              slug: "money",             order: 1  },
  { name: "Energy",             slug: "energy",            order: 2  },
  { name: "Broadband",          slug: "broadband",         order: 3  },
  { name: "Travel",             slug: "travel",            order: 4  },
  { name: "Food & Drink",       slug: "food-drink",        order: 5  },
  { name: "Shopping & Rewards", slug: "shopping-rewards",  order: 6  },
  { name: "Wellbeing",          slug: "wellbeing",         order: 7  },
  { name: "Motoring",           slug: "motoring",          order: 8  },
  { name: "Miscellaneous",      slug: "miscellaneous",     order: 9  },
  { name: "Business Tools",     slug: "business-tools",    order: 10 },
  { name: "Lifestyle",          slug: "lifestyle",         order: 11 },
];

// ── Seed links keyed by new category slug ─────────────────────────────────────

const seedLinks: Record<string, Array<{ brandName: string; url: string; headline?: string }>> = {
  "energy": [
    {
      brandName: "Octopus Energy",
      url: "https://share.octopus.energy/intense-forest-708",
      headline: "£50 Joining Bonus",
    },
    {
      brandName: "Octopus Energy (Solar)",
      url: "https://tech.referrals.octopus.energy/uTE0ShcS",
      headline: "£100 Visa Card",
    },
  ],
  "broadband": [
    {
      brandName: "Starlink",
      url: "https://starlink.com/residential?referral=RC-DF-8482272-38250-49&app_source=share",
      headline: "1 Month Free",
    },
  ],
  motoring: [
    {
      brandName: "Tesla",
      url: "http://ts.la/nikhil72778",
      headline: "£500 or 650 Supercharger Miles",
    },
  ],
  money: [
    {
      brandName: "Interactive Investor",
      url: "https://www.ii.co.uk/recommend-ii",
      headline: "1 Year Free Subscription",
    },
  ],
  "shopping-rewards": [
    {
      brandName: "TopCashback",
      url: "https://www.topcashback.co.uk/ref/nehadua1",
      headline: "£10 Sign Up Bonus",
    },
  ],
  "food-drink": [
    {
      brandName: "Uber Eats",
      url: "https://ubereats.com/feed?promoCode=eats-nehab9514ue",
      headline: "Get £10 off your first order",
    },
  ],
  miscellaneous: [
    {
      brandName: "Hostinger UK",
      url: "https://www.hostinger.com/uk?REFERRALCODE=MUVNIKHILA5D",
      headline: "20% Discount",
    },
    {
      brandName: "Rotimatic",
      url: "https://rotimatic.com/products/rotimatic-next?utm_source=referralhero&utm_medium=link&mwr=nikhil-ddf3",
      headline: "£74 Discount",
    },
  ],
};

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database…");

  // Seed admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where:  { email: process.env.ADMIN_EMAIL ?? "admin@trustrefer.co.uk" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@trustrefer.co.uk",
      name:  "TrustRefer Admin",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Seed categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories seeded`);

  // Seed links
  let linkCount = 0;
  for (const [slug, links] of Object.entries(seedLinks)) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) continue;

    for (const link of links) {
      const seedId = `seed-${slug}-${link.brandName.toLowerCase().replace(/\s+/g, "-")}`;
      await prisma.link.upsert({
        where:  { id: seedId },
        update: {},
        create: {
          id: seedId,
          brandName:  link.brandName,
          url:        link.url,
          headline:   link.headline,
          categoryId: category.id,
          isApproved: true,
          isActive:   true,
        },
      });
      linkCount++;
    }
  }
  console.log(`✅ ${linkCount} links seeded`);
  console.log("🎉 Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Energy", slug: "energy", order: 1 },
  { name: "Broadband", slug: "broadband", order: 2 },
  { name: "Mobile", slug: "mobile", order: 3 },
  { name: "EV / Car", slug: "ev-car", order: 4 },
  { name: "Banking", slug: "banking", order: 5 },
  { name: "Investing Apps", slug: "investing-apps", order: 6 },
  { name: "Food Delivery", slug: "food-delivery", order: 7 },
  { name: "Meal Kits", slug: "meal-kits", order: 8 },
  { name: "Insurance", slug: "insurance", order: 9 },
  { name: "Solar / Battery", slug: "solar-battery", order: 10 },
  { name: "Travel", slug: "travel", order: 11 },
  { name: "Home Services", slug: "home-services", order: 12 },
  { name: "Cashback", slug: "cashback", order: 13 },
  { name: "Miscellaneous", slug: "miscellaneous", order: 14 },
];

const seedLinks: Record<string, Array<{ brandName: string; url: string; headline?: string }>> = {
  energy: [
    {
      brandName: "Octopus Energy",
      url: "https://share.octopus.energy/intense-forest-708",
      headline: "£50 Joining Bonus",
    },
  ],
  broadband: [
    {
      brandName: "Starlink",
      url: "https://starlink.com/residential?referral=RC-DF-8482272-38250-49&app_source=share",
      headline: "1 Month Free",
    },
  ],
  "ev-car": [
    {
      brandName: "Tesla",
      url: "http://ts.la/nikhil72778",
      headline: "£500 or 650 Supercharger Miles",
    },
  ],
  "investing-apps": [
    {
      brandName: "Interactive Investor",
      url: "https://www.ii.co.uk/recommend-ii",
      headline: "1 Year Free Subscription",
    },
  ],
  "solar-battery": [
    {
      brandName: "Octopus Energy (Solar)",
      url: "https://tech.referrals.octopus.energy/uTE0ShcS",
      headline: "£100 Visa Card",
    },
  ],
  cashback: [
    {
      brandName: "TopCashback",
      url: "https://www.topcashback.co.uk/ref/nehadua1",
      headline: "£10 Sign Up Bonus",
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

async function main() {
  console.log("🌱 Seeding database...");

  // Seed admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@trustrefer.co.uk" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@trustrefer.co.uk",
      name: "TrustRefer Admin",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Seed categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
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
      await prisma.link.upsert({
        where: { id: `seed-${slug}-${link.brandName.toLowerCase().replace(/\s+/g, "-")}` },
        update: {},
        create: {
          id: `seed-${slug}-${link.brandName.toLowerCase().replace(/\s+/g, "-")}`,
          brandName: link.brandName,
          url: link.url,
          headline: link.headline,
          categoryId: category.id,
          isApproved: true,
          isActive: true,
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

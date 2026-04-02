export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeSearch } from "@/components/home/HomeSearch";
import { UserBenefitPanel } from "@/components/home/UserBenefitPanel";
import { HeroLogo } from "@/components/home/HeroLogo";
import type { CategoryWithLinks } from "@/types";

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        links: {
          where: { isApproved: true, isActive: true },
          orderBy: { voteScore: "desc" },
          include: {
            category: true,
            votes: true,
            reports: true,
            comments: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const [categoriesRaw, session] = await Promise.all([
    getCategories(),
    auth(),
  ]);
  const categories = categoriesRaw as unknown as CategoryWithLinks[];

  const user = session?.user as any;
  const isLoggedIn = !!user?.id;
  const isPremium = user?.membershipTier === "PREMIUM";

  let waitlistLinkIds: string[] = [];
  if (isLoggedIn && isPremium) {
    try {
      const entries = await prisma.waitlistEntry.findMany({
        where: { userId: user.id },
        select: { linkId: true },
      });
      waitlistLinkIds = entries.map((e: { linkId: string }) => e.linkId);
    } catch (error) {
      console.error("Failed to fetch waitlist entries:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <HeroLogo />
        </div>

        <HomeSearch
          categories={categories}
          isLoggedIn={isLoggedIn}
          isPremium={isPremium}
          waitlistLinkIds={waitlistLinkIds}
        />

        {!isLoggedIn && (
          <div className="mt-10">
            <UserBenefitPanel />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";

import { unstable_cache } from "next/cache";
import { prisma, withRetry } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeSearch } from "@/components/home/HomeSearch";
import { HeroLogo } from "@/components/home/HeroLogo";
import { BrandTicker } from "@/components/home/BrandTicker";
import { PricingSection } from "@/components/home/PricingSection";
import { MembershipStatus } from "@/components/home/MembershipStatus";
import type { CategoryWithLinks } from "@/types";

const getCategories = unstable_cache(
  () =>
    withRetry(() =>
      prisma.category.findMany({
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
      })
    ),
  ["categories"],
  { revalidate: 60, tags: ["categories"] }
);

export default async function HomePage() {
  const [categoriesResult, session] = await Promise.all([
    getCategories().then((data) => ({ data, error: false as const })).catch(() => ({ data: [], error: true as const })),
    auth(),
  ]);
  const categories = categoriesResult.data as unknown as CategoryWithLinks[];
  const dbError = categoriesResult.error;

  const user = session?.user;
  const isLoggedIn = !!user?.id;
  const isPremium = user?.membershipTier === "PREMIUM";

  let waitlistLinkIds: string[] = [];
  let subscription: { currentPeriodEnd: Date | null; cancelAtPeriodEnd: boolean } | null = null;

  if (isLoggedIn) {
    try {
      // Run sequentially to avoid exhausting the single pgbouncer connection
      subscription = await prisma.subscription.findUnique({
        where: { userId: user.id },
        select: { currentPeriodEnd: true, cancelAtPeriodEnd: true },
      });
      if (isPremium) {
        const entries = await prisma.waitlistEntry.findMany({
          where: { userId: user.id },
          select: { linkId: true },
        });
        waitlistLinkIds = entries.map((e: { linkId: string }) => e.linkId);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <HeroLogo />
        </div>

        {dbError && (
          <div className="mb-6 rounded-md border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            We&apos;re having trouble loading referral links right now. Please refresh the page in a moment.
          </div>
        )}

        {/* Membership status bar — only for logged-in paid users */}
        {isLoggedIn && user.membershipTier !== "STANDARD" && (
          <MembershipStatus
            tier={user.membershipTier}
            currentPeriodEnd={subscription?.currentPeriodEnd ?? null}
            cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
          />
        )}

        <BrandTicker />

        <HomeSearch
          categories={categories}
          isLoggedIn={isLoggedIn}
          isPremium={isPremium}
          waitlistLinkIds={waitlistLinkIds}
        />

        {/* Pricing section — only for logged-out users */}
        {!isLoggedIn && (
          <PricingSection
            isLoggedIn={isLoggedIn}
            currentTier={user?.membershipTier}
          />
        )}

      </main>

      <Footer />
    </div>
  );
}

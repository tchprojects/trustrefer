import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeSearch } from "@/components/home/HomeSearch";
import { UserBenefitPanel } from "@/components/home/UserBenefitPanel";
import type { CategoryWithLinks } from "@/types";

async function getCategories(): Promise<CategoryWithLinks[]> {
  return prisma.category.findMany({
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
}

export default async function HomePage() {
  const [categories, session] = await Promise.all([
    getCategories(),
    auth(),
  ]);

  const user = session?.user as any;
  const isLoggedIn = !!user?.id;
  const isPremium = user?.membershipTier === "PREMIUM";

  let waitlistLinkIds: string[] = [];
  if (isLoggedIn && isPremium) {
    const entries = await prisma.waitlistEntry.findMany({
      where: { userId: user.id },
      select: { linkId: true },
    });
    waitlistLinkIds = entries.map((e: { linkId: string }) => e.linkId);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            TrustRefer
          </h1>
          <p className="mt-2 text-sm text-[#888]">
            Our trusted referral community hub
          </p>
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

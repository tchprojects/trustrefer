import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubmitForm } from "@/components/home/SubmitForm";

export const metadata = {
  title: "Submit a Link — TrustRefer",
};

export default async function SubmitPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
        <h1 className="mb-2 text-xl font-semibold text-white">Submit a referral link</h1>
        <p className="mb-8 text-sm text-[#888]">
          Share a referral link with the community. Our team reviews all submissions before
          they go live.
        </p>
        <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-6">
          <SubmitForm categories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

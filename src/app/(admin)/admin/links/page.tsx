import { prisma } from "@/lib/prisma";
import { LinkReviewTable } from "@/components/admin/LinkReviewTable";

export const metadata = { title: "Links — Admin" };

export default async function AdminLinksPage() {
  const submissions = await prisma.linkSubmission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-white">
        Pending submissions{" "}
        <span className="text-sm font-normal text-[#888]">({submissions.length})</span>
      </h1>
      <LinkReviewTable submissions={submissions} categories={categories} />
    </div>
  );
}

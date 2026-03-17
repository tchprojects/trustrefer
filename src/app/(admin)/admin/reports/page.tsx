import { prisma } from "@/lib/prisma";
import { ReportTable } from "@/components/admin/ReportTable";

export const metadata = { title: "Reports — Admin" };

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      link: { select: { brandName: true, url: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-white">
        Open reports{" "}
        <span className="text-sm font-normal text-[#888]">({reports.length})</span>
      </h1>
      <ReportTable reports={reports} />
    </div>
  );
}

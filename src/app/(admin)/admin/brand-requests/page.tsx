import { prisma } from "@/lib/prisma";
import { BrandRequestTable } from "@/components/admin/BrandRequestTable";

export const metadata = { title: "Brand Requests — TrustRefer Admin" };

async function getPendingRequests() {
  return prisma.brandRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { name: true, email: true, membershipTier: true } },
      category: { select: { name: true } },
    },
  });
}

export default async function BrandRequestsPage() {
  const requests = await getPendingRequests();

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-white">Brand Requests</h1>
      <BrandRequestTable requests={requests} />
    </div>
  );
}

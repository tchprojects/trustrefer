import { prisma } from "@/lib/prisma";
import { WaitlistTable } from "@/components/admin/WaitlistTable";

export const metadata = { title: "Waitlist — TrustRefer Admin" };

async function getWaitlistEntries() {
  return prisma.waitlistEntry.findMany({
    orderBy: [{ linkId: "asc" }, { position: "asc" }],
    include: {
      user: { select: { name: true, email: true, membershipTier: true } },
      link: { select: { brandName: true, url: true } },
    },
  });
}

export default async function WaitlistPage() {
  const entries = await getWaitlistEntries();

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-white">Waitlist</h1>
      <WaitlistTable entries={entries} />
    </div>
  );
}

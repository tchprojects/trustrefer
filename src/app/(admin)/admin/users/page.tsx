import { prisma } from "@/lib/prisma";
import { UserTable } from "@/components/admin/UserTable";

export const metadata = { title: "Users — Admin" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      membershipTier: true,
      createdAt: true,
      _count: { select: { submissions: true, votes: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-white">
        Users{" "}
        <span className="text-sm font-normal text-[#888]">({users.length})</span>
      </h1>
      <UserTable users={users} />
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/Badge";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  membershipTier: string;
  createdAt: Date;
  _count: { submissions: number; votes: number };
}

interface UserTableProps {
  users: UserRow[];
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-sm text-[#555]">No users yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-md border border-[#1f1f1f]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#888]">User</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#888]">Role</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#888]">Tier</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#888]">Activity</th>
            <th className="px-4 py-2.5 text-left text-xs font-medium text-[#888]">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-[#1f1f1f] last:border-0 hover:bg-[#0a0a0a]">
              <td className="px-4 py-3">
                <div>
                  <p className="text-white">{user.name ?? "—"}</p>
                  <p className="text-xs text-[#555]">{user.email}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    user.role === "SUPER_ADMIN"
                      ? "danger"
                      : user.role === "ADMIN"
                      ? "warning"
                      : "muted"
                  }
                >
                  {user.role}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.membershipTier === "PREMIUM" ? "success" : "muted"}>
                  {user.membershipTier === "PREMIUM" ? "Premium" : "Standard"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-[#888]">
                {user._count.submissions} submissions · {user._count.votes} votes
              </td>
              <td className="px-4 py-3 text-xs text-[#888]">
                {new Date(user.createdAt).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

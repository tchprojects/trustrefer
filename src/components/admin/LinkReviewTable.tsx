"use client";

import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { useToast } from "@/components/ui/Toaster";
import { formatUrl } from "@/lib/utils";
import type { LinkSubmission, User } from "@prisma/client";

type Submission = LinkSubmission & {
  user: Pick<User, "name" | "email">;
};

interface LinkReviewTableProps {
  submissions: Submission[];
  categories: { id: string; name: string }[];
}

export function LinkReviewTable({ submissions, categories }: LinkReviewTableProps) {
  const { toast } = useToast();
  const [items, setItems] = useState(submissions);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleApprove(sub: Submission) {
    setLoadingId(sub.id);
    const res = await fetch(`/api/admin/submissions/${sub.id}/approve`, { method: "POST" });
    if (res.ok) {
      setItems((prev) => prev.filter((s) => s.id !== sub.id));
      toast(`${sub.brandName} approved`);
    } else {
      toast("Failed to approve submission", "error");
    }
    setLoadingId(null);
  }

  async function handleReject(sub: Submission) {
    setLoadingId(sub.id);
    const res = await fetch(`/api/admin/submissions/${sub.id}/reject`, { method: "POST" });
    if (res.ok) {
      setItems((prev) => prev.filter((s) => s.id !== sub.id));
      toast(`${sub.brandName} rejected`, "info");
    } else {
      toast("Failed to reject submission", "error");
    }
    setLoadingId(null);
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-[#555]">No pending submissions. You&apos;re all caught up.</p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((sub) => {
        const cat = categories.find((c) => c.id === sub.categoryId);
        const isLoading = loadingId === sub.id;
        return (
          <div
            key={sub.id}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-white text-sm">{sub.brandName}</span>
                  {cat && <Badge variant="muted">{cat.name}</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#555]">
                  <span>{formatUrl(sub.url)}</span>
                  <a
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                    title="Open link"
                  >
                    <ExternalLink size={11} />
                  </a>
                </div>
                {sub.note && (
                  <p className="mt-2 text-xs text-[#888] italic">&ldquo;{sub.note}&rdquo;</p>
                )}
                <p className="mt-1.5 text-xs text-[#555]">
                  by {sub.user.name ?? sub.user.email} ·{" "}
                  {new Date(sub.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Tooltip content="Reject" side="top">
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={isLoading}
                    onClick={() => handleReject(sub)}
                  >
                    <X size={13} />
                  </Button>
                </Tooltip>
                <Tooltip content="Approve" side="top">
                  <Button
                    size="sm"
                    disabled={isLoading}
                    loading={isLoading}
                    onClick={() => handleApprove(sub)}
                  >
                    <Check size={13} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

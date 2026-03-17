"use client";

import { useState } from "react";

type VoteType = "UP" | "DOWN";

export function useVote(linkId: string, initialScore: number) {
  const [score, setScore] = useState(initialScore);
  const [voted, setVoted] = useState<VoteType | null>(null);
  const [loading, setLoading] = useState(false);

  async function vote(type: VoteType) {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const delta = type === "UP" ? 1 : -1;
    const revert = voted === type ? -delta : voted ? delta * 2 : delta;
    setScore((s) => s + revert);
    setVoted((v) => (v === type ? null : type));

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId, type }),
      });

      if (res.status === 401) {
        // Revert optimistic update and redirect
        setScore((s) => s - revert);
        setVoted((v) => (v === type ? null : voted));
        window.location.href = "/login";
      }

      if (!res.ok) {
        // Revert on error
        setScore((s) => s - revert);
        setVoted(voted);
      }
    } catch {
      setScore((s) => s - revert);
      setVoted(voted);
    } finally {
      setLoading(false);
    }
  }

  return { score, voted, loading, vote };
}

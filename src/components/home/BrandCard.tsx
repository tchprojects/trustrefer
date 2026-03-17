"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Flag, Clock } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useToast } from "@/components/ui/Toaster";
import type { LinkWithRelations } from "@/types";

interface BrandCardProps {
  link: LinkWithRelations;
  isLoggedIn: boolean;
  isPremium: boolean;
  isOnWaitlist: boolean;
  onReport: (linkId: string) => void;
  onWaitlist: (linkId: string) => void;
}

export function BrandCard({
  link,
  isLoggedIn,
  isPremium,
  isOnWaitlist,
  onReport,
  onWaitlist,
}: BrandCardProps) {
  const { toast } = useToast();
  const [upAnim, setUpAnim] = useState(false);
  const [downAnim, setDownAnim] = useState(false);
  const [upFloat, setUpFloat] = useState(false);
  const [downFloat, setDownFloat] = useState(false);

  function handleClick() {
    fetch(`/api/links/${link.id}/click`, { method: "POST" }).catch(() => {});
  }

  async function handleVote(type: "UP" | "DOWN") {
    if (type === "UP") {
      setUpAnim(true);
      setUpFloat(true);
      setTimeout(() => setUpAnim(false), 420);
      setTimeout(() => setUpFloat(false), 750);
    } else {
      setDownAnim(true);
      setDownFloat(true);
      setTimeout(() => setDownAnim(false), 420);
      setTimeout(() => setDownFloat(false), 750);
    }

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: link.id, type }),
      });
      if (res.status === 401) {
        toast("Sign in to vote on links", "info");
      }
    } catch {
      // silently fail
    }
  }

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0 transition-colors hover:bg-white/[0.02]">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-[#111] text-xs font-semibold uppercase text-white">
        {link.brandName.charAt(0)}
      </div>

      {/* Main content — brand name is the link */}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="min-w-0 flex-1 flex items-center gap-2 group"
      >
        <span className="truncate text-sm font-medium text-white underline underline-offset-2 decoration-white/20 group-hover:decoration-white/50 transition-all">
          {link.brandName}
        </span>
        {link.headline && (
          <span className="shrink-0 rounded border border-white/10 bg-[#111] px-1.5 py-0.5 text-[11px] text-[#aaa] group-hover:border-white/20 transition-colors">
            {link.headline}
          </span>
        )}
      </a>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        {/* Upvote — always visible */}
        <div className="relative">
          {upFloat && (
            <span className="pointer-events-none absolute bottom-full left-0 mb-0.5 select-none text-[11px] font-semibold text-green-400 animate-float-up">
              +1
            </span>
          )}
          <button
            onClick={() => handleVote("UP")}
            className={`flex items-center justify-center h-7 w-7 rounded text-green-700/60 transition-colors hover:bg-white/[0.04] hover:text-green-400 ${upAnim ? "animate-vote-pop" : ""}`}
          >
            <ThumbsUp size={13} fill="currentColor" />
          </button>
        </div>

        {/* Downvote — always visible */}
        <div className="relative">
          {downFloat && (
            <span className="pointer-events-none absolute bottom-full left-0 mb-0.5 select-none text-[11px] font-semibold text-red-500/80 animate-float-up">
              -1
            </span>
          )}
          <button
            onClick={() => handleVote("DOWN")}
            className={`flex items-center justify-center h-7 w-7 rounded text-red-900/50 transition-colors hover:bg-white/[0.04] hover:text-red-600/70 ${downAnim ? "animate-vote-pop" : ""}`}
          >
            <ThumbsDown size={13} fill="currentColor" />
          </button>
        </div>

        {/* Report — logged-in users only */}
        {isLoggedIn && (
          <Tooltip content="Report an issue" side="top">
            <button
              onClick={() => onReport(link.id)}
              className="flex h-7 w-7 items-center justify-center rounded text-[#333] transition-colors hover:bg-white/[0.04] hover:text-[#666]"
            >
              <Flag size={12} />
            </button>
          </Tooltip>
        )}

        {/* Waitlist — premium users only */}
        {isPremium && (
          <Tooltip
            content={isOnWaitlist ? "You're on the waitlist" : "Join waitlist"}
            side="top"
          >
            <button
              onClick={() => !isOnWaitlist && onWaitlist(link.id)}
              className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                isOnWaitlist
                  ? "text-amber-500/70 cursor-default"
                  : "text-[#333] hover:bg-white/[0.04] hover:text-amber-400/70"
              }`}
            >
              <Clock size={12} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

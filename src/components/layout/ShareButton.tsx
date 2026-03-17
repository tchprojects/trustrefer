"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "https://trustrefer.co.uk";
    try {
      if (navigator.share) {
        await navigator.share({ title: "TrustRefer", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled or API unavailable
    }
  }

  return (
    <Tooltip content={copied ? "Copied!" : "Share this page"} side="bottom">
      <button
        onClick={handleShare}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[#666] transition-colors hover:bg-white/5 hover:text-white"
      >
        {copied ? <Check size={15} className="text-white" /> : <Share2 size={15} />}
      </button>
    </Tooltip>
  );
}

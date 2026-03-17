"use client";

import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded border border-white/10 bg-[#1a1a1a] px-2 py-1 text-xs text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100",
          side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
          side === "bottom" && "top-full left-1/2 mt-2 -translate-x-1/2",
          side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2",
          side === "left" && "right-full top-1/2 mr-2 -translate-y-1/2"
        )}
      >
        {content}
      </span>
    </span>
  );
}

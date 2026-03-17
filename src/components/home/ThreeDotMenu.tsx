"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, ThumbsDown, Flag } from "lucide-react";

interface ThreeDotMenuProps {
  linkId: string;
  onReport: (linkId: string) => void;
}

export function ThreeDotMenu({ linkId, onReport }: ThreeDotMenuProps) {
  async function handleDownvote() {
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId, type: "DOWN" }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
      }
    } catch {
      // silently fail
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex h-7 w-7 items-center justify-center rounded text-[#555] transition-colors hover:bg-[#1f1f1f] hover:text-white focus:outline-none">
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-[140px] rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenu.Item
            onClick={handleDownvote}
            className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 text-sm text-[#888] outline-none transition-colors hover:bg-[#111] hover:text-white select-none"
          >
            <ThumbsDown size={13} />
            Downvote
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => onReport(linkId)}
            className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 text-sm text-[#888] outline-none transition-colors hover:bg-[#111] hover:text-white select-none"
          >
            <Flag size={13} />
            Report
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

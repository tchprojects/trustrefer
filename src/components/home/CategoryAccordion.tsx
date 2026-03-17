"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { BrandCard } from "./BrandCard";
import { ReportModal } from "./ReportModal";
import { BrandRequestModal } from "./BrandRequestModal";
import { WaitlistModal } from "./WaitlistModal";
import { Tooltip } from "@/components/ui/Tooltip";
import type { CategoryWithLinks } from "@/types";

interface CategoryAccordionProps {
  categories: CategoryWithLinks[];
  isLoggedIn: boolean;
  isPremium: boolean;
  waitlistLinkIds: string[];
}

export function CategoryAccordion({
  categories,
  isLoggedIn,
  isPremium,
  waitlistLinkIds = [],
}: CategoryAccordionProps) {
  const [reportLinkId, setReportLinkId] = useState<string | null>(null);
  const [brandRequestCategoryId, setBrandRequestCategoryId] = useState<string | null>(null);
  const [waitlistLinkId, setWaitlistLinkId] = useState<string | null>(null);

  const firstWithLinks = categories.find((c) => c.links.length > 0);
  const defaultValue = firstWithLinks ? [firstWithLinks.id] : [];

  const categoriesWithLinks = categories.filter((c) => c.links.length > 0);
  const empty = categories.filter((c) => c.links.length === 0);

  return (
    <>
      <Accordion.Root type="multiple" defaultValue={defaultValue} className="space-y-2">
        {categoriesWithLinks.map((cat) => (
          <Accordion.Item
            key={cat.id}
            value={cat.id}
            className="overflow-hidden rounded-md border border-white/15 bg-[#0a0a0a]"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-white">{cat.name}</span>
                  <span className="rounded border border-white/10 bg-[#111] px-1.5 py-0.5 text-xs text-[#666]">
                    {cat.links.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Plus icon — logged-in users only, stops accordion toggle */}
                  {isLoggedIn && (
                    <Tooltip content="Request a new brand in this category" side="top">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setBrandRequestCategoryId(cat.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            setBrandRequestCategoryId(cat.id);
                          }
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded text-[#333] transition-colors hover:bg-white/[0.06] hover:text-[#888]"
                      >
                        <Plus size={13} />
                      </span>
                    </Tooltip>
                  )}
                  <ChevronDown
                    size={14}
                    className="text-[#444] transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="border-t border-white/10">
                {cat.links.map((link) => (
                  <BrandCard
                    key={link.id}
                    link={link}
                    isLoggedIn={isLoggedIn}
                    isPremium={isPremium}
                    isOnWaitlist={waitlistLinkIds.includes(link.id)}
                    onReport={setReportLinkId}
                    onWaitlist={setWaitlistLinkId}
                  />
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}

        {empty.length > 0 && (
          <div className="pt-2">
            <p className="mb-2 text-xs text-[#444]">Coming soon</p>
            <div className="flex flex-wrap gap-2">
              {empty.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded border border-white/10 px-3 py-1.5 text-xs text-[#444]"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Accordion.Root>

      <ReportModal linkId={reportLinkId} onClose={() => setReportLinkId(null)} />
      <BrandRequestModal
        categoryId={brandRequestCategoryId}
        onClose={() => setBrandRequestCategoryId(null)}
      />
      <WaitlistModal
        linkId={waitlistLinkId}
        onClose={() => setWaitlistLinkId(null)}
      />
    </>
  );
}

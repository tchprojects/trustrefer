"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BrandCard } from "./BrandCard";
import { ReportModal } from "./ReportModal";
import { BrandRequestModal } from "./BrandRequestModal";
import { WaitlistModal } from "./WaitlistModal";
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
  const [openItems, setOpenItems] = useState<string[]>([]);
  const itemRefs = useRef<Map<string, Element>>(new Map());
  const categoriesWithLinks = categories.filter((c) => c.links.length > 0);
  const empty = categories.filter((c) => c.links.length === 0);

  // Auto-close accordion items when they scroll out of view
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    itemRefs.current.forEach((el, id) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            setOpenItems((prev) =>
              prev.includes(id) ? prev.filter((v) => v !== id) : prev
            );
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      cleanups.push(() => observer.disconnect());
    });
    return () => cleanups.forEach((fn) => fn());
  }, [categories]);

  return (
    <>
      <Accordion.Root
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="grid grid-cols-1 gap-2 md:grid-cols-2"
      >
        {categoriesWithLinks.map((cat) => {
          const isOpen = openItems.includes(cat.id);
          return (
          <Accordion.Item
            key={cat.id}
            value={cat.id}
            ref={(el) => {
              if (el) itemRefs.current.set(cat.id, el);
              else itemRefs.current.delete(cat.id);
            }}
            className="overflow-hidden rounded-md border border-white/15 bg-[#0a0a0a]"
          >
            {/* Header row: trigger area + ADD BRAND button as siblings (never nested buttons) */}
            <Accordion.Header asChild>
              <div className="flex items-center transition-colors hover:bg-white/[0.03]">
                <Accordion.Trigger className="group flex flex-1 cursor-pointer items-center justify-between px-4 py-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl font-semibold tracking-tight text-white">{cat.name}</span>
                  </div>
                  <div className="flex items-center pl-3">
                    {isOpen
                      ? <X size={14} className="text-white" />
                      : <ChevronDown size={14} className="text-white" />
                    }
                  </div>
                </Accordion.Trigger>

                {/* ADD BRAND — sibling of Trigger, not inside it */}
                {isLoggedIn && (
                  <div className="pr-3">
                    <button
                      type="button"
                      onClick={() => setBrandRequestCategoryId(cat.id)}
                      className="cursor-pointer rounded border border-white/20 bg-white px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-black transition-opacity hover:opacity-80"
                    >
                      Add Brand
                    </button>
                  </div>
                )}
              </div>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=open]:overflow-visible data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="border-t border-white/10">
                {/* Financial warning for money-related category */}
                {cat.slug === "money" && (
                  <div className="flex items-start gap-2 border-b border-white/5 bg-yellow-950/10 px-4 py-2.5">
                    <span className="mt-0.5 shrink-0 text-yellow-600">⚠</span>
                    <p className="text-[11px] leading-relaxed text-yellow-700">
                      <span className="font-medium text-yellow-600">Financial note: </span>
                      Links in this category relate to financial products and services. TrustRefer is
                      not a financial adviser and nothing here constitutes financial advice. Always read
                      the provider&apos;s terms before proceeding. Your capital may be at risk.{" "}
                      <a
                        href="/disclaimer"
                        className="underline underline-offset-2 hover:text-yellow-500"
                      >
                        Learn more
                      </a>
                      .
                    </p>
                  </div>
                )}
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
        )})}

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

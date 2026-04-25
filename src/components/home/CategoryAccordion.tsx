"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BrandCard } from "./BrandCard";
import { ReportModal } from "./ReportModal";
import { BrandRequestModal } from "./BrandRequestModal";
import { WaitlistModal } from "./WaitlistModal";
import type { CategoryWithLinks } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  "money":            "/images/categories/money.png",
  "home-bills":       "/images/categories/home-bills.png",
  "tech-mobile":      "/images/categories/tech-mobile.png",
  "travel":           "/images/categories/travel.png",
  "food-drink":       "/images/categories/food-drink.png",
  "shopping-rewards": "/images/categories/shopping-rewards.png",
  "wellbeing":        "/images/categories/wellbeing.png",
  "motoring":         "/images/categories/motoring.png",
  "business-tools":   "/images/categories/business-tools.png",
  "lifestyle":        "/images/categories/lifestyle.png",
};

interface CategoryAccordionProps {
  categories: CategoryWithLinks[];
  isLoggedIn: boolean;
  isPremium: boolean;
  isPaid: boolean;
  waitlistLinkIds: string[];
}

export function CategoryAccordion({
  categories,
  isLoggedIn,
  isPremium,
  isPaid,
  waitlistLinkIds = [],
}: CategoryAccordionProps) {
  const [reportLinkId, setReportLinkId] = useState<string | null>(null);
  const [brandRequestCategoryId, setBrandRequestCategoryId] = useState<string | null>(null);
  const [waitlistLinkId, setWaitlistLinkId] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const itemRefs = useRef<Map<string, Element>>(new Map());
  const categoriesWithLinks = categories.filter((c) => c.links.length > 0);
  const empty = categories.filter((c) => c.links.length === 0);
  const allCategories = [...categoriesWithLinks, ...empty];

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
        {allCategories.map((cat) => {
          const isOpen = openItems.includes(cat.id);
          const hasLinks = cat.links.length > 0;
          return (
          <Accordion.Item
            key={cat.id}
            value={cat.id}
            ref={(el) => {
              if (el) itemRefs.current.set(cat.id, el);
              else itemRefs.current.delete(cat.id);
            }}
            className={`overflow-hidden rounded-md border bg-[#0a0a0a] ${hasLinks ? "border-white/15" : "border-white/8"}`}
          >
            {/* Header row: trigger area + ADD BRAND button as siblings (never nested buttons) */}
            <Accordion.Header asChild>
              <div className="flex items-center transition-colors hover:bg-white/[0.03]">
                <Accordion.Trigger className="group flex flex-1 cursor-pointer items-center justify-between px-4 py-1.5 text-left">
                  <div className="flex items-center gap-2.5">
                    {CATEGORY_ICONS[cat.slug] && (
                      <img
                        src={CATEGORY_ICONS[cat.slug]}
                        alt=""
                        className={`h-12 w-12 shrink-0 object-contain ${hasLinks ? "opacity-100 brightness-150" : "opacity-50"}`}
                      />
                    )}
                    <span className={`text-base font-semibold tracking-tight ${hasLinks ? "text-white" : "text-[#555]"}`}>{cat.name}</span>
                  </div>
                  <div className="flex items-center pl-3">
                    {isOpen
                      ? <X size={14} className={hasLinks ? "text-white" : "text-[#444]"} />
                      : <ChevronDown size={14} className={hasLinks ? "text-white" : "text-[#444]"} />
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
                {!hasLinks ? (
                  <div className="px-4 py-6 text-center">
                    {isLoggedIn && isPaid
                      ? <p className="text-sm text-[#444]">Be the first to submit one.</p>
                      : <p className="text-sm text-[#444]">Referrals coming soon</p>
                    }
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        )})}

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

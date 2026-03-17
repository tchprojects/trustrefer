"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { CategoryAccordion } from "./CategoryAccordion";
import { BrandCard } from "./BrandCard";
import { ReportModal } from "./ReportModal";
import { WaitlistModal } from "./WaitlistModal";
import { useSearch } from "@/hooks/useSearch";
import type { CategoryWithLinks } from "@/types";

interface HomeSearchProps {
  categories: CategoryWithLinks[];
  isLoggedIn: boolean;
  isPremium: boolean;
  waitlistLinkIds: string[];
}

export function HomeSearch({
  categories,
  isLoggedIn,
  isPremium,
  waitlistLinkIds,
}: HomeSearchProps) {
  const { query, setQuery, results } = useSearch(categories);
  const [reportLinkId, setReportLinkId] = useState<string | null>(null);
  const [waitlistLinkId, setWaitlistLinkId] = useState<string | null>(null);

  return (
    <>
      <SearchBar value={query} onChange={setQuery} className="mb-6" />

      {results !== null ? (
        <div>
          <p className="mb-3 text-xs text-[#555]">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
          </p>
          {results.length > 0 && (
            <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] overflow-hidden">
              {results.map((link) => (
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
          )}
        </div>
      ) : (
        <CategoryAccordion
          categories={categories}
          isLoggedIn={isLoggedIn}
          isPremium={isPremium}
          waitlistLinkIds={waitlistLinkIds}
        />
      )}

      <ReportModal linkId={reportLinkId} onClose={() => setReportLinkId(null)} />
      <WaitlistModal linkId={waitlistLinkId} onClose={() => setWaitlistLinkId(null)} />
    </>
  );
}

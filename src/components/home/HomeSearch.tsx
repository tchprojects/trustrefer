"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { CategoryAccordion } from "./CategoryAccordion";
import { BrandCard } from "./BrandCard";
import { ReportModal } from "./ReportModal";
import { useSearch } from "@/hooks/useSearch";
import type { CategoryWithLinks } from "@/types";

interface HomeSearchProps {
  categories: CategoryWithLinks[];
}

export function HomeSearch({ categories }: HomeSearchProps) {
  const { query, setQuery, results } = useSearch(categories);
  const [reportLinkId, setReportLinkId] = useState<string | null>(null);

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
                <BrandCard key={link.id} link={link as any} onReport={setReportLinkId} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <CategoryAccordion categories={categories} />
      )}

      <ReportModal linkId={reportLinkId} onClose={() => setReportLinkId(null)} />
    </>
  );
}

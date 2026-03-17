"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import type { CategoryWithLinks } from "@/types";

export function useSearch(categories: CategoryWithLinks[]) {
  const [query, setQuery] = useState("");

  // Flatten all links with their category name for searching
  const items = useMemo(
    () =>
      categories.flatMap((cat) =>
        cat.links.map((link) => ({
          ...link,
          categoryName: cat.name,
          categorySlug: cat.slug,
        }))
      ),
    [categories]
  );

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["brandName", "headline", "categoryName"],
        threshold: 0.35,
        includeScore: true,
      }),
    [items]
  );

  const results = useMemo(() => {
    if (!query.trim()) return null;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query]);

  return { query, setQuery, results };
}

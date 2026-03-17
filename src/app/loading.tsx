import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Search bar skeleton */}
      <Skeleton className="mb-8 h-10 w-full rounded-md" />

      {/* Accordion skeletons */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-md border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-6 rounded" />
              </div>
              <Skeleton className="h-3 w-3 rounded" />
            </div>
            {i === 0 && (
              <div className="border-t border-white/10">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3 border-b border-[#1a1a1a] px-4 py-3.5 last:border-b-0">
                    <Skeleton className="h-8 w-8 rounded shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { RowsSkeleton, StatsSkeleton } from "@/components/skeletons/stats-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="border-b border-border bg-card/20 backdrop-blur-xl px-4 sm:px-8 py-4 lg:py-0 lg:h-16 flex items-center">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <StatsSkeleton />
        <Skeleton className="h-10 rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <RowsSkeleton rows={6} />
      </div>
    </>
  );
}

import { StatsSkeleton } from "@/components/skeletons/stats-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="border-b border-border bg-card/20 backdrop-blur-xl px-4 sm:px-8 py-4 lg:py-0 lg:h-16 flex items-center">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
        <StatsSkeleton />
      </div>
    </>
  );
}

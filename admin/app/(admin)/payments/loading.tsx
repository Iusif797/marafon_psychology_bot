import { Card } from "@/components/ui/card";
import { StatsSkeleton, RowsSkeleton } from "@/components/skeletons/stats-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="border-b border-border bg-card/20 backdrop-blur-xl px-4 sm:px-8 py-4 lg:py-0 lg:h-16 flex items-center">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <StatsSkeleton />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-5 w-1/4" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-32" />
        </Card>
        <RowsSkeleton rows={4} />
      </div>
    </>
  );
}

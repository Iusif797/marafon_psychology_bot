import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="border-b border-border bg-card/20 backdrop-blur-xl px-4 sm:px-8 py-4 lg:py-0 lg:h-16 flex items-center">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              <Skeleton className="h-60 rounded-md" />
              <Skeleton className="h-60 rounded-2xl" />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

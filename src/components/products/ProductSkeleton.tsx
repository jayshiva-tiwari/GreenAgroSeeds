import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm h-full animate-pulse">
      <div className="relative aspect-square overflow-hidden bg-slate-200" />
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
           <Skeleton className="h-6 w-3/4 rounded-md" />
           <Skeleton className="h-6 w-1/4 rounded-md" />
        </div>
        <div className="space-y-2">
           <Skeleton className="h-3 w-full rounded-md" />
           <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>
        <div className="mt-auto pt-6 flex gap-3">
           <Skeleton className="h-10 w-full rounded-lg" />
           <Skeleton className="h-10 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

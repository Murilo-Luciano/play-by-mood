import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export default function SkeletonLoading() {
  return (
    <main className="flex flex-col p-4 text-center overflow-x-hidden">
      <Skeleton className="w-full h-9 my-16" />
      <ScrollArea className="self-start p-4 rounded-lg border w-full">
        <div className="flex flex-row gap-3 overflow-y-auto">
          {Array(8)
            .fill(undefined)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="w-[264px] h-[148px] rounded-2xl"
              />
            ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex gap-8">
          <div className="flex flex-col gap-1">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>

          <div className="flex flex-col gap-1">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>

        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-full h-80" />
      </div>
    </main>
  );
}

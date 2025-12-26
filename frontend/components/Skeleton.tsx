import React from "react";
import Card from "./Card";

export function Skeleton({ className = "", height = "h-4", width = "w-full" }: { className?: string; height?: string; width?: string }) {
  return (
    <div
      className={`bg-nier-border/30 animate-pulse ${height} ${width} ${className}`}
    />
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="h-full flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        <Skeleton width="w-20" height="h-6" />
      </div>
      <Skeleton height="h-8" width="w-3/4" />
      <div className="space-y-2 my-4">
        <Skeleton width="w-1/2" />
        <Skeleton width="w-1/3" />
        <Skeleton width="w-2/3" />
      </div>
      <div className="mt-auto pt-4 border-t border-nier-border/30 flex justify-between">
        <Skeleton width="w-16" />
        <Skeleton width="w-24" />
      </div>
    </Card>
  );
}

export function EventDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-pulse">
      <Card className="flex flex-col gap-4">
        <Skeleton height="h-8" width="w-1/2" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <Skeleton width="w-3/4" />
            <Skeleton width="w-1/2" />
          </div>
          <div className="space-y-4">
            <Skeleton width="w-3/4" />
            <Skeleton width="w-1/2" />
          </div>
        </div>
      </Card>
      <Card>
        <Skeleton height="h-6" width="w-1/4" className="mb-4" />
        <div className="space-y-2">
          <Skeleton />
          <Skeleton />
          <Skeleton width="w-3/4" />
        </div>
      </Card>
    </div>
  );
}

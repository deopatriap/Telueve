import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button";
  lines?: number;
}

export function Skeleton({ className = "", variant = "text", lines = 1 }: SkeletonProps) {
  const baseStyles = "skeleton rounded-none";

  if (variant === "text") {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
          />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`border border-nier-border p-6 ${className}`}>
        <div className={`${baseStyles} h-6 w-3/4 mb-4`} />
        <div className="space-y-2 mb-4">
          <div className={`${baseStyles} h-4 w-full`} />
          <div className={`${baseStyles} h-4 w-full`} />
          <div className={`${baseStyles} h-4 w-2/3`} />
        </div>
        <div className={`${baseStyles} h-10 w-full`} />
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={`${baseStyles} w-12 h-12 rounded-full ${className}`} />
    );
  }

  if (variant === "button") {
    return (
      <div className={`${baseStyles} h-12 w-32 ${className}`} />
    );
  }

  return <div className={`${baseStyles} ${className}`} />;
}

export function EventCardSkeleton() {
  return (
    <div className="border border-nier-border overflow-hidden animate-fade-in">
      {/* Header skeleton */}
      <div className="skeleton h-24 w-full" />

      {/* Body skeleton */}
      <div className="p-6 space-y-4">
        <div className="skeleton h-5 w-3/4" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-4 w-1/3" />
        </div>
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
}

export function EventDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="border border-nier-border p-6">
        <div className="skeleton h-8 w-2/3 mb-6" />
        <div className="space-y-3">
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton h-5 w-1/3" />
          <div className="skeleton h-5 w-2/5" />
        </div>
      </div>

      {/* Description Card */}
      <div className="border border-nier-border p-6">
        <div className="skeleton h-6 w-1/4 mb-4" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>

      {/* Action Card */}
      <div className="border border-nier-border p-6">
        <div className="skeleton h-6 w-1/3 mb-4" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
}

export default Skeleton;

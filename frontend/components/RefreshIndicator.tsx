"use client";

import React, { useState, useEffect } from "react";

interface RefreshIndicatorProps {
  lastUpdated: Date;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function RefreshIndicator({ lastUpdated, onRefresh, isLoading }: RefreshIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
      if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-nier-muted">
      <span>Synced: {timeAgo || "Just now"}</span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="hover:text-nier-dark transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-spin inline-block">↻</span>
          ) : (
            "↻"
          )}
        </button>
      )}
    </div>
  );
}

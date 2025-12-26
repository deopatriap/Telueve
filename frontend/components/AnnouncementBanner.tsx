"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
// Removed lucide-react dependency, using simple SVG or text

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminAPI.getPublicAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        // silently fail
      }
    };
    fetch();
  }, []);

  if (announcements.length === 0) return null;

  const current = announcements[currentIndex];

  const bgColor = {
    info: "bg-nier-dark text-nier-cream",
    warning: "bg-nier-warning text-nier-dark",
    error: "bg-red-900 text-white",
    success: "bg-nier-success text-white"
  }[current.type] || "bg-nier-dark text-nier-cream";

  return (
    <div className={`w-full ${bgColor} px-4 py-2 text-sm font-mono tracking-widest uppercase flex justify-between items-center relative overflow-hidden`}>
      <div className="flex-1 text-center animate-fade-in">
        <span className="font-bold mr-2">[{current.type.toUpperCase()}]</span>
        {current.title}: <span className="normal-case tracking-normal ml-2">{current.content}</span>
      </div>

      {announcements.length > 1 && (
        <div className="absolute right-4 flex gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
            className="hover:opacity-75 transition-opacity text-xs border border-current px-1"
          >
            NEXT &gt;
          </button>
        </div>
      )}

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
    </div>
  );
}

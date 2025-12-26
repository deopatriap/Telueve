"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { pageIn, pageOut } from "@/lib/animations";
import { useAnimation } from "@/components/AnimationProvider";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useAnimation();

  useEffect(() => {
    if (isReducedMotion) return;
    if (containerRef.current) {
      pageIn(containerRef.current);
    }
  }, [pathname, isReducedMotion]);

  return (
    <div ref={containerRef} className="opacity-0">
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { animateCounter } from "@/lib/animations";
import { useAnimation } from "@/components/AnimationProvider";

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  className?: string;
}

export default function StatsCounter({ value, label, suffix = "", className = "" }: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isReducedMotion) {
      if (ref.current) ref.current.innerHTML = String(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current && ref.current) {
            animateCounter(ref.current, value);
            hasAnimated.current = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, isReducedMotion]);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-4xl font-bold text-nier-dark mb-1 font-mono">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="text-sm uppercase tracking-widest text-nier-muted">
        {label}
      </div>
    </div>
  );
}

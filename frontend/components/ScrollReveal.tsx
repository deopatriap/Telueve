"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { useAnimation } from "@/components/AnimationProvider";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-up";
  delay?: number;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  threshold = 0.2
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isReducedMotion) {
      if (ref.current) ref.current.style.opacity = "1";
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Initial state
    element.style.opacity = "0";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            const animProps: any = {
              targets: element,
              opacity: [0, 1],
              duration: 800,
              easing: 'easeOutExpo',
              delay: delay
            };

            if (animation === "fade-up") {
              animProps.translateY = [30, 0];
            } else if (animation === "scale-up") {
              animProps.scale = [0.8, 1];
            }

            anime(animProps);
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [animation, delay, isReducedMotion, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

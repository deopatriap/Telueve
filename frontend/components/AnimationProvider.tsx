"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import anime from "animejs";

interface AnimationContextType {
  isReducedMotion: boolean;
  isLowPerformance: boolean;
  initPageLoad: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  isReducedMotion: false,
  isLowPerformance: false,
  initPageLoad: true,
});

export const useAnimation = () => useContext(AnimationContext);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [initPageLoad, setInitPageLoad] = useState(true);

  useEffect(() => {
    // Detect user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    // Simple performance heuristic: core count
    if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator) {
      const cores = (navigator as any).hardwareConcurrency;
      if (cores && cores <= 4) {
        setIsLowPerformance(true);
      }
    }

    // Listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Simulate initial load animation completion
    const timer = setTimeout(() => {
      setInitPageLoad(false);
    }, 1000);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimationContext.Provider value={{ isReducedMotion, isLowPerformance, initPageLoad }}>
      {children}
    </AnimationContext.Provider>
  );
}

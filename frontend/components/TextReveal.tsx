"use client";

import { useEffect, useRef } from "react";
import { revealText } from "@/lib/animations";
import { useAnimation } from "@/components/AnimationProvider";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  as: Component = "div"
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { isReducedMotion } = useAnimation();

  useEffect(() => {
    if (isReducedMotion || !ref.current) return;

    // Split text into characters wrapped in spans for animation
    // Note: This is a simple implementation. For words, splitting by ' ' is better.
    // Here we assume we want character reveal for "hacker theme" feel.
    const chars = ref.current.querySelectorAll('.char');
    if (chars.length > 0) {
      revealText(chars, delay);
    }
  }, [text, delay, isReducedMotion]);

  const renderText = () => {
    return text.split("").map((char, index) => (
      <span key={index} className="char inline-block" style={{ opacity: isReducedMotion ? 1 : 0 }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <Component ref={ref as any} className={`overflow-hidden ${className}`}>
      {renderText()}
    </Component>
  );
}

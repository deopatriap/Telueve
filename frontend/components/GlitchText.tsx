"use client";

import React, { useEffect, useRef } from "react";
import { glitchText } from "@/lib/animations";
import { useAnimation } from "@/components/AnimationProvider";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  trigger?: "mount" | "hover" | "manual";
  manualTrigger?: number;
}

export default function GlitchText({
  text,
  as: Component = "span",
  className = "",
  trigger = "mount",
  manualTrigger = 0
}: GlitchTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { isReducedMotion } = useAnimation();
  const [displayText, setDisplayText] = React.useState(text);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  const triggerGlitch = () => {
    if (isReducedMotion || !ref.current) return;

    // Reset to random chars immediately handled by glitchText
    glitchText(ref.current, text, setDisplayText);
  };

  useEffect(() => {
    if (trigger === "mount") {
      triggerGlitch();
    }
  }, [trigger, isReducedMotion]);

  useEffect(() => {
    if (trigger === "manual" && manualTrigger > 0) {
      triggerGlitch();
    }
  }, [manualTrigger]);

  return (
    <Component
      ref={ref as any}
      className={`inline-block whitespace-pre-wrap ${className}`}
      onMouseEnter={trigger === "hover" ? triggerGlitch : undefined}
    >
      {displayText}
    </Component>
  );
}

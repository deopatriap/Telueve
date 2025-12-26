"use client";

import React, { useRef } from "react";
import Button, { ButtonProps } from "./Button";
import { magneticHover, resetMagnetic } from "@/lib/animations";
import { useAnimation } from "@/components/AnimationProvider";

interface MagneticButtonProps extends ButtonProps {
  strength?: number;
}

export default function MagneticButton({
  strength = 15,
  onMouseEnter,
  onMouseLeave,
  children,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useAnimation();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isReducedMotion) return;
    magneticHover(buttonRef.current, e, strength);
  };

  const handleLeave = (e: React.MouseEvent) => {
    if (isReducedMotion) return;
    resetMagnetic(buttonRef.current);
    if (onMouseLeave) onMouseLeave(e as any);
  };

  return (
    <div
      ref={buttonRef}
      className={`inline-block ${props.fullWidth ? 'w-full' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onMouseEnter={onMouseEnter as any}
    >
      <Button {...props} className={`pointer-events-auto ${props.className || ''}`}>
        {children}
      </Button>
    </div>
  );
}

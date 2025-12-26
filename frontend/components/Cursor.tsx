"use client";

import { useEffect, useState } from "react";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null
      );
    };

    const handleMouseDown = () => setMouseDown(true);
    const handleMouseUp = () => setMouseDown(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Use a simple null check first to avoid hydration mismatch
  if (!mounted) return null;

  // Hide on mobile/touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main Cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden md:block" // Hidden on mobile via css too
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div
          className={`
            relative -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out
            ${isPointer ? "w-12 h-12" : "w-8 h-8"}
            ${mouseDown ? "scale-90" : "scale-100"}
          `}
        >
          {/* Outer Ring */}
          <div className={`
             absolute inset-0 border border-nier-dark rounded-full opacity-50
             ${isPointer ? "border-dashed animate-spin-slow" : "border-solid"}
          `} />

          {/* Inner Dot */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-nier-dark rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Crosshairs when pointer */}
          <div className={`
            absolute top-1/2 left-1/2 w-full h-[1px] bg-nier-dark/30 -translate-x-1/2 -translate-y-1/2 transition-opacity
            ${isPointer ? "opacity-100" : "opacity-0"}
          `} />
          <div className={`
            absolute top-1/2 left-1/2 h-full w-[1px] bg-nier-dark/30 -translate-x-1/2 -translate-y-1/2 transition-opacity
            ${isPointer ? "opacity-100" : "opacity-0"}
          `} />
        </div>
      </div>
    </>
  );
}

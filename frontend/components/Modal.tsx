"use client";

import React, { useEffect, useState } from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to allow render before animation
      setTimeout(() => setIsAnimating(true), 10);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      // Wait for animation to finish before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isVisible && !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-nier-dark/40 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-nier-cream border border-nier-border shadow-2xl
          transform transition-all duration-300
          ${isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `}
      >
        {/* Nier Decorators */}
        <div className="absolute top-0 left-0 w-4 h-[1px] bg-nier-dark" />
        <div className="absolute top-0 left-0 h-4 w-[1px] bg-nier-dark" />
        <div className="absolute top-0 right-0 w-4 h-[1px] bg-nier-dark" />
        <div className="absolute top-0 right-0 h-4 w-[1px] bg-nier-dark" />
        <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-nier-dark" />
        <div className="absolute bottom-0 left-0 h-4 w-[1px] bg-nier-dark" />
        <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-nier-dark" />
        <div className="absolute bottom-0 right-0 h-4 w-[1px] bg-nier-dark" />

        {/* Header decoration line */}
        <div className="absolute top-2 left-2 right-2 h-[1px] bg-nier-dark/10" />

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-nier-border/50 bg-nier-cream relative z-10">
          <h3 className="text-lg font-bold uppercase tracking-widest text-nier-dark">
            {title || "System Message"}
          </h3>
          <button
            onClick={onClose}
            className="text-nier-muted hover:text-nier-dark transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 relative z-10">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-nier-sand/20 border-t border-nier-border/50 flex justify-end gap-3 relative z-10">
            {footer}
          </div>
        )}

        {/* Bottom decoration line */}
        <div className="absolute bottom-2 left-2 right-2 h-[1px] bg-nier-dark/10" />
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  onClick,
  type = "button",
  disabled = false,
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
}: ButtonProps) {
  const baseStyles = `
    uppercase tracking-widest
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `;

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantStyles = {
    primary: `
      border border-nier-dark bg-nier-dark text-nier-cream
      hover:bg-nier-accent active:scale-[0.98]
    `,
    outline: `
      border border-nier-dark bg-transparent text-nier-dark
      hover:bg-nier-dark hover:text-nier-cream active:scale-[0.98]
    `,
    danger: `
      border border-red-800 bg-red-800 text-nier-cream
      hover:bg-red-900 active:scale-[0.98]
    `,
    ghost: `
      border border-transparent bg-transparent text-nier-dark
      hover:bg-nier-sand active:scale-[0.98]
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

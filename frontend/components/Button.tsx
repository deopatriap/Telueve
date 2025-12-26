"use client";

import React from "react";

export interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
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
  fullWidth = false,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const baseStyles = `
    uppercase tracking-widest font-bold
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
    flex items-center justify-center gap-2
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
      shadow-sm hover:shadow-md hover:shadow-nier-dark/20
    `,
    secondary: `
      border border-nier-border bg-nier-highlight text-nier-dark
      hover:bg-nier-sand active:scale-[0.98]
    `,
    outline: `
      border border-nier-dark bg-transparent text-nier-dark
      hover:bg-nier-dark hover:text-nier-cream active:scale-[0.98]
    `,
    danger: `
      border border-nier-error bg-nier-error text-nier-cream
      hover:opacity-90 active:scale-[0.98]
    `,
    success: `
      border border-nier-success bg-nier-success text-nier-cream
      hover:opacity-90 active:scale-[0.98]
    `,
    ghost: `
      border border-transparent bg-transparent text-nier-dark
      hover:bg-nier-sand/50 active:scale-[0.98]
    `,
  };

  const widthStyles = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
    >
      {loading ? (
        <>
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
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="w-4 h-4">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="w-4 h-4">{icon}</span>}
        </>
      )}
    </button>
  );
}

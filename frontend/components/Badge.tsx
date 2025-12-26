import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    uppercase font-bold tracking-widest
    transition-colors duration-200
  `;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  const variantStyles = {
    default: "bg-nier-dark text-nier-cream border border-nier-dark",
    success: "bg-nier-success/10 text-nier-success border border-nier-success",
    warning: "bg-nier-warning/10 text-nier-warning border border-nier-warning",
    error: "bg-nier-error/10 text-nier-error border border-nier-error",
    info: "bg-nier-info/10 text-nier-info border border-nier-info",
    outline: "bg-transparent text-nier-dark border border-nier-dark",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

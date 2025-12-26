import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "elevated" | "bordered";
  decorative?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  variant = "default",
  decorative = false,
}: CardProps) {
  const baseStyles = `
    bg-nier-cream p-6 transition-all duration-300 relative
  `;

  const variantStyles = {
    default: "border border-nier-border shadow-md hover:shadow-lg hover:-translate-y-0.5",
    elevated: "shadow-lg hover:shadow-xl",
    bordered: "border-2 border-nier-dark",
  };

  const clickableStyles = onClick ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${clickableStyles} ${className}`}
    >
      {/* Inner border decoration */}
      {decorative && (
        <div className="absolute inset-1 border border-nier-border opacity-50 pointer-events-none" />
      )}

      {/* Corner decorations */}
      {decorative && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-nier-dark" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-nier-dark" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-nier-dark" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-nier-dark" />
        </>
      )}

      {children}
    </div>
  );
}

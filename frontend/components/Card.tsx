import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "elevated" | "bordered" | "interactive";
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
    border border-nier-border
  `;

  const variantStyles = {
    default: "shadow-sm border-nier-border/50",
    elevated: "shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1 bg-white/50 backdrop-blur-sm",
    bordered: "border-2 border-nier-dark",
    interactive: "hover:border-nier-dark hover:bg-white cursor-pointer active:scale-[0.99] hover:-translate-y-1 hover:shadow-lg transition-all duration-300",
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

      {/* Nier Corner decorations */}
      {decorative && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 bg-nier-dark" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-nier-dark" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-nier-dark" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-nier-dark" />

          {/* Connecting lines */}
          <div className="absolute top-1 left-1 right-1 h-[1px] bg-nier-dark/20" />
          <div className="absolute bottom-1 left-1 right-1 h-[1px] bg-nier-dark/20" />
        </>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

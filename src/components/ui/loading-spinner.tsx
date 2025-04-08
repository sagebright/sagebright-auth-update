
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "accent1" | "accent2" | "charcoal";
}

export function LoadingSpinner({
  size = "md",
  className,
  variant = "primary"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  const variantClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent1: "text-accent1",
    accent2: "text-accent2",
    charcoal: "text-charcoal"
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
    </div>
  );
}

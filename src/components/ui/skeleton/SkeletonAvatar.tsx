
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const SkeletonAvatar = ({
  className,
  size = "md",
}: SkeletonAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse",
        sizeClasses[size],
        className
      )}
    />
  );
};

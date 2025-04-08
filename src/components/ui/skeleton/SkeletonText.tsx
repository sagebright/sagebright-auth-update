
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonTextProps {
  className?: string;
  lines?: number;
  width?: string | string[];
}

export const SkeletonText = ({
  className,
  lines = 1,
  width = "100%",
}: SkeletonTextProps) => {
  const widths = Array.isArray(width)
    ? width
    : Array(lines).fill(width);

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  );
};

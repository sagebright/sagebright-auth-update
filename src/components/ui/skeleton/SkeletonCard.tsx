
import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  header?: boolean;
  footer?: boolean;
}

export const SkeletonCard = ({
  className,
  header = true,
  footer = false,
}: SkeletonCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden",
        className
      )}
    >
      {header && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse opacity-70" />
        </div>
      )}
      
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      
      {footer && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between">
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

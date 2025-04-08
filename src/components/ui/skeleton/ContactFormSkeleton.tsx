
import React from "react";
import { cn } from "@/lib/utils";

interface ContactFormSkeletonProps {
  className?: string;
}

export const ContactFormSkeleton = ({ className }: ContactFormSkeletonProps) => {
  return (
    <div className={cn("rounded-2xl bg-white p-6 shadow-card md:p-8", className)}>
      <div className="space-y-6">
        {/* Name fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Email field */}
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Company field */}
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Checkbox field */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Message field */}
        <div className="space-y-1.5">
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Submit button */}
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
};

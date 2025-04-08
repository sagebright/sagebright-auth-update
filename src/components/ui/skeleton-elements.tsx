
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SkeletonTextProps {
  lines?: number;
  width?: string;
  className?: string;
}

export function SkeletonText({ lines = 1, width = "full", className }: SkeletonTextProps) {
  const widthClass = width === "full" ? "w-full" : `w-${width}`;
  
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4", 
            widthClass,
            // Make lines after first one different widths for visual effect
            i > 0 && lines > 1 && i === lines - 1 ? "w-3/4" : "",
            i > 0 && lines > 1 && i !== lines - 1 ? "w-5/6" : ""
          )} 
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <Avatar className={cn("bg-muted", className)}>
      <AvatarFallback className="bg-muted">
        <Skeleton className="h-full w-full rounded-full" />
      </AvatarFallback>
    </Avatar>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-5", className)}>
      <Skeleton className="h-[125px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("h-10 w-24 rounded-md", className)} />
  );
}

export function SkeletonTableRow({ columns = 4, className }: { columns?: number; className?: string }) {
  return (
    <div className={cn("flex gap-4 items-center", className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4", 
            i === 0 ? "w-12" : i === columns - 1 ? "w-16" : "flex-1"
          )} 
        />
      ))}
    </div>
  );
}

export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 3, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <div className="pt-2">
        <SkeletonButton className="w-32 h-10" />
      </div>
    </div>
  );
}

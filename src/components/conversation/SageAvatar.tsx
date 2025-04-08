
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SageAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "away" | "offline";
  className?: string;
  src?: string;
}

export function SageAvatar({
  size = "md",
  status = "online",
  className,
  src = "/lovable-uploads/sage_avatar.png",
}: SageAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-14 w-14",
  };

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src} alt="Sage" />
        <AvatarFallback className="bg-primary text-primary-foreground">SB</AvatarFallback>
      </Avatar>
      
      {/* Status indicator */}
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 block rounded-full border-2 border-background",
            "h-2.5 w-2.5",
            status === "online" && "bg-green-500",
            status === "away" && "bg-amber-500", 
            status === "offline" && "bg-slate-400"
          )}
        />
      )}
    </div>
  );
}

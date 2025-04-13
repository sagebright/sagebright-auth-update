
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ChatBubbleProps {
  content: string;
  sender: "user" | "sage" | "system";
  timestamp?: Date;
  avatarUrl?: string;
  avatarFallback?: string;
  className?: string;
  isTyping?: boolean;
}

export function ChatBubble({
  content,
  sender,
  timestamp,
  avatarUrl,
  avatarFallback,
  className,
  isTyping = false,
}: ChatBubbleProps) {
  const isSage = sender === "sage";
  const isUser = sender === "user";
  const isSystem = sender === "system";

  return (
    <div
      className={cn(
        "flex w-full max-w-3xl mx-auto items-start gap-3 py-2",
        isUser ? "justify-end" : "justify-start",
        isSystem && "justify-center",
        className
      )}
    >
      {/* Avatar - only shown for sage or if provided for user */}
      {!isSystem && (isSage || avatarUrl) && (
        <Avatar className={cn("h-8 w-8 shrink-0", isUser ? "order-last" : "")}>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className={isSage ? "bg-primary text-primary-foreground" : ""}>
            {avatarFallback || (isSage ? "SB" : "U")}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "px-4 py-2.5 rounded-lg max-w-[80%] text-sm break-words",
          isSage && "bg-sagebright-accent/20 text-charcoal",
          isUser && "bg-primary text-primary-foreground",
          isSystem && "bg-muted text-muted-foreground text-center text-xs py-1 px-2 max-w-md"
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1">
            <span>{content}</span>
            <span className="flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
            </span>
          </div>
        ) : (
          content
        )}

        {/* Optional timestamp */}
        {timestamp && (
          <div
            className={cn(
              "text-[10px] mt-1 opacity-70",
              isUser ? "text-right" : "text-left"
            )}
          >
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </div>
  );
}

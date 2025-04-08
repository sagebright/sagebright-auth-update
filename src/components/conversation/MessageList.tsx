
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatBubble, ChatBubbleProps } from "./ChatBubble";

interface MessageListProps {
  messages: Omit<ChatBubbleProps, "avatarFallback">[];
  className?: string;
  isTyping?: boolean;
  sageAvatarUrl?: string;
  userAvatarUrl?: string;
  autoScroll?: boolean;
}

export function MessageList({
  messages,
  className,
  isTyping = false,
  sageAvatarUrl = "/lovable-uploads/sage_avatar.png",
  userAvatarUrl,
  autoScroll = true,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, autoScroll]);

  return (
    <div className={cn("flex flex-col w-full overflow-y-auto py-4", className)}>
      {messages.map((message, index) => (
        <ChatBubble
          key={index}
          content={message.content}
          sender={message.sender}
          timestamp={message.timestamp}
          avatarUrl={message.sender === "sage" ? sageAvatarUrl : message.avatarUrl || userAvatarUrl}
          avatarFallback={message.sender === "sage" ? "SB" : "U"}
        />
      ))}
      
      {isTyping && (
        <ChatBubble
          content="Sage is typing..."
          sender="system"
          className="opacity-70"
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}


import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatBubble, ChatBubbleProps } from "./ChatBubble";
import { Message } from "@/types/chat";

interface MessageListProps {
  messages: (Omit<ChatBubbleProps, "avatarFallback"> | Message)[];
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
      {messages.map((message, index) => {
        // Handle both the Message type and the ChatBubbleProps type
        const isMessage = 'id' in message;
        
        return (
          <ChatBubble
            key={isMessage ? message.id : index}
            content={message.content}
            sender={message.sender}
            timestamp={isMessage ? message.timestamp : undefined}
            avatarUrl={message.sender === "sage" ? sageAvatarUrl : (isMessage ? message.avatar_url : userAvatarUrl)}
            avatarFallback={message.sender === "sage" ? "SB" : "U"}
            isTyping={isMessage && message.isLoading}
          />
        );
      })}
      
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

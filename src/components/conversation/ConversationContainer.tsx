
import React from 'react';
import { cn } from "@/lib/utils";
import { MessageList } from './MessageList';
import { ConversationInput } from './ConversationInput';
import { ChatBubbleProps } from './ChatBubble';

interface ConversationContainerProps {
  messages: Omit<ChatBubbleProps, "avatarFallback">[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  sageAvatarUrl?: string;
  userAvatarUrl?: string;
  className?: string;
  inputDisabled?: boolean;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export function ConversationContainer({
  messages,
  onSendMessage,
  isTyping = false,
  sageAvatarUrl,
  userAvatarUrl,
  className,
  inputDisabled = false,
  headerSlot,
  footerSlot,
}: ConversationContainerProps) {
  return (
    <div className={cn(
      "flex flex-col h-full bg-background",
      className
    )}>
      {headerSlot && (
        <div className="flex-shrink-0 border-b border-border">
          {headerSlot}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          sageAvatarUrl={sageAvatarUrl}
          userAvatarUrl={userAvatarUrl}
          className="h-full px-3 md:px-6"
        />
      </div>

      <div className="flex-shrink-0 border-t border-border p-3">
        <ConversationInput
          onSend={onSendMessage}
          disabled={inputDisabled}
          placeholder="Type your message to Sage..."
          className="bg-background border border-input"
        />
      </div>

      {footerSlot && (
        <div className="flex-shrink-0 border-t border-border">
          {footerSlot}
        </div>
      )}
    </div>
  );
}

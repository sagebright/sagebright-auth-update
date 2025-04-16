
import React, { useRef, useEffect } from 'react';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { ChatMessage } from '@/components/ask-sage/ChatMessage';
import { SuggestedQuestions } from '@/components/ask-sage/SuggestedQuestions';
import { WelcomeMessage } from '@/components/ask-sage/WelcomeMessage';
import { TypingIndicator } from '@/components/ask-sage/TypingIndicator';
import { Message } from '@/types/chat';

interface AskSageContentProps {
  messages: Message[];
  isLoading: boolean;
  suggestedQuestions?: string[];
  handleSelectQuestion: (question: string) => void;
  sendMessageToSage: (content: string) => void;
  handleReflectionSubmit?: (reflection: string) => void;
  handleFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
  isContextReady: boolean;
  showWelcomeMessage?: boolean;
  voiceParam?: string;
  isProtected?: boolean;
  canInteract?: boolean;
  canSendMessages?: boolean;
}

export const AskSageContent: React.FC<AskSageContentProps> = ({
  messages,
  isLoading,
  suggestedQuestions = [],
  handleSelectQuestion,
  sendMessageToSage,
  handleFeedback,
  isContextReady,
  showWelcomeMessage = true,
  voiceParam = 'default',
  isProtected = false,
  canInteract = true,
  canSendMessages = true
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-6">
        {/* Show welcome message if no messages yet */}
        {showWelcomeMessage && messages.length === 0 && (
          <WelcomeMessage voiceParam={voiceParam} />
        )}
        
        {/* Show messages */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            handleFeedback={handleFeedback}
          />
        ))}
        
        {/* Show typing indicator when loading */}
        {isLoading && (
          <div className="py-2">
            <TypingIndicator />
          </div>
        )}
        
        {/* Show suggested questions if available and not loading */}
        {!isLoading && suggestedQuestions.length > 0 && messages.length > 0 && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={handleSelectQuestion}
          />
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input bar with condition */}
      <div className="border-t border-border p-3">
        <ChatInputBar 
          onSend={sendMessageToSage} 
          isLoading={isLoading}
          disabled={!canInteract || !canSendMessages || isProtected}
          disabledReason={
            isProtected 
              ? "Sage is initializing..." 
              : !canSendMessages 
                ? "Context still loading..." 
                : !canInteract 
                  ? "Please wait..." 
                  : undefined
          }
        />
        
        {/* Context not ready warning message for development */}
        {process.env.NODE_ENV === 'development' && !canSendMessages && (
          <div className="mt-2 text-xs text-amber-500 px-2">
            ⚠️ Message sending disabled: Context hydration incomplete. See debug panel for details.
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { ChatMessage } from '@/components/ask-sage/ChatMessage';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { TypingIndicator } from '@/components/ask-sage/TypingIndicator';
import { WelcomeMessage } from '@/components/ask-sage/WelcomeMessage';
import { SuggestedQuestions } from '@/components/ask-sage/SuggestedQuestions';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ReflectionData } from './ReflectionForm';

interface AskSageContentProps {
  messages: any[];
  isLoading: boolean;
  suggestedQuestions: string[];
  handleSelectQuestion: (question: string) => void;
  sendMessageToSage: (content: string) => void;
  handleReflectionSubmit: (data: ReflectionData) => void;
  handleFeedback: (messageId: string, feedback: string) => void;
  isContextReady: boolean;
  showWelcomeMessage: boolean;
  voiceParam: string | null;
  isProtected?: boolean; // Added missing props to interface
  canInteract?: boolean;  
}

export const AskSageContent: React.FC<AskSageContentProps> = ({
  messages,
  isLoading,
  suggestedQuestions,
  handleSelectQuestion,
  sendMessageToSage,
  handleReflectionSubmit,
  handleFeedback,
  isContextReady,
  showWelcomeMessage,
  voiceParam,
  isProtected = false, // Default value
  canInteract = true   // Default value
}) => {
  const { currentUser } = useAuth();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <ErrorBoundary fallback={
          <div className="p-4 bg-red-50 text-red-800 rounded-lg my-4">
            <h3 className="font-medium">Something went wrong displaying messages</h3>
            <p>Try refreshing the page or contact support if the issue persists.</p>
          </div>
        }>
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome message - only show when no messages and context is ready */}
            {isContextReady && showWelcomeMessage && (
              <WelcomeMessage 
                voiceParam={voiceParam}
                userName={currentUser?.first_name}
              />
            )}
            
            {/* Messages */}
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onFeedback={handleFeedback} 
              />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </ErrorBoundary>
        
        {/* Suggested questions - only show when no messages */}
        {isContextReady && messages.length === 0 && !isLoading && suggestedQuestions.length > 0 && (
          <SuggestedQuestions 
            questions={suggestedQuestions}
            onSelectQuestion={handleSelectQuestion}
          />
        )}
      </div>

      <div className="flex-shrink-0">
        <ChatInputBar 
          onSendMessage={sendMessageToSage} 
          onReflectionSubmit={(data: ReflectionData) => handleReflectionSubmit(data)}
          isLoading={isLoading}
          suggestedQuestions={suggestedQuestions}
          onSelectQuestion={handleSelectQuestion}
          disabled={!isContextReady || !canInteract || isProtected}
        />
      </div>
    </div>
  );
};

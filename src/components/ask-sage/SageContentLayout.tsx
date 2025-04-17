
import React from 'react';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { AskSageContent } from '@/components/ask-sage/AskSageContent';
import { DebugHeader } from '@/components/ask-sage/DebugHeader';
import { Message } from '@/types/chat';
import { ReflectionData } from '@/types/reflection';

interface SageContentLayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isProtected: boolean;
  voiceParam: string | null;
  voiceSource: string;
  isSessionStable: boolean;
  canSendMessages: boolean;
  messages: Message[];
  isLoading: boolean;
  suggestedQuestions: string[];
  handleSelectQuestion: (question: string) => void;
  sendMessageToSage: (content: string) => void;
  handleReflectionSubmit: (data: ReflectionData) => void;
  handleFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  isContextReady: boolean;
  showWelcomeMessage: boolean;
  canInteract: boolean;
  isOrgReady: boolean;
}

export const SageContentLayout: React.FC<SageContentLayoutProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isProtected,
  voiceParam,
  voiceSource,
  isSessionStable,
  canSendMessages,
  messages,
  isLoading,
  suggestedQuestions,
  handleSelectQuestion,
  sendMessageToSage,
  handleReflectionSubmit,
  handleFeedback,
  isContextReady,
  showWelcomeMessage,
  canInteract,
  isOrgReady
}) => {
  return (
    <div className="flex flex-col h-full -m-4 md:-m-8">
      <ChatHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isProtected={isProtected}
      />

      <DebugHeader 
        voiceParam={voiceParam}
        voiceSource={voiceSource}
        isSessionStable={isSessionStable}
        isProtected={isProtected}
        canSendMessages={canSendMessages}
      />

      <div className="flex flex-1 overflow-hidden">
        <AskSageContent 
          messages={messages}
          isLoading={isLoading}
          suggestedQuestions={suggestedQuestions}
          handleSelectQuestion={handleSelectQuestion}
          sendMessageToSage={sendMessageToSage}
          handleReflectionSubmit={handleReflectionSubmit}
          handleFeedback={handleFeedback}
          isContextReady={isContextReady}
          showWelcomeMessage={showWelcomeMessage}
          voiceParam={voiceParam}
          isProtected={isProtected}
          canInteract={canInteract}
          canSendMessages={canSendMessages}
        />

        {isContextReady && sidebarOpen && (
          <div className="hidden md:flex flex-col w-80 border-l border-border bg-background p-4 overflow-y-auto">
            <ResourcesSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

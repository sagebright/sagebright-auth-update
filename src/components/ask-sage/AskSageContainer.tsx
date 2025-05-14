
import React from 'react';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import AuthRequiredUI from './AuthRequiredUI';
import LoadingUI from './LoadingUI';
import OrgRecoveryUI from './OrgRecoveryUI';
import HydrationUI from './HydrationUI';
import AskSageContent from './AskSageContent';
import DebugHeader from './DebugHeader';
import { FeedbackType } from '@/types/chat';

/**
 * Main container for the Ask Sage chatbot interface
 * Handles authentication, loading states, and organization context recovery
 */
const AskSageContainer: React.FC = () => {
  const {
    // Auth state
    authLoading,
    isAuthenticated,
    userId,
    orgId,
    canInteract,
    
    // Context and hydration state
    shouldRender,
    contextHydration,
    isRecoveringOrg,
    
    // Messaging
    messages,
    inputValue,
    handleInputChange,
    handleFormSubmit,
    handleClearHistory,
    isMessageSending,
    canSendMessages,
    handleFeedback,
    
    // Voice parameters
    voiceParam,
    
    // Debug
    debugPanel
  } = useAskSagePage();

  // Force boolean type for isRecoveringOrg to resolve TypeScript error
  const isRecoveringOrgBoolean: boolean = Boolean(isRecoveringOrg);

  // Check if loading states should be displayed
  if (!shouldRender || authLoading || !canInteract) {
    return <LoadingUI state={contextHydration} />;
  }

  // Organization recovery UI
  if (isRecoveringOrgBoolean) {
    return <OrgRecoveryUI />;
  }

  // Show hydration UI if context is loading or timed out
  if (contextHydration.hydration.isLoading || contextHydration.hydration.timedOut) {
    return <HydrationUI state={contextHydration} />;
  }

  // Auth check - show login UI if not authenticated
  if (!isAuthenticated || !userId || !orgId) {
    return <AuthRequiredUI />;
  }

  // Adapting feedback types between different parts of the application
  const handleFeedbackAdapter = (messageId: string, feedback: 'like' | 'dislike'): void => {
    // Map 'like'/'dislike' to 'positive'/'negative' for backend compatibility
    const adaptedFeedback: 'positive' | 'negative' = 
      feedback === 'like' ? 'positive' : 'negative';
    
    // Call the original handler with the adapted feedback type
    handleFeedback(messageId, adaptedFeedback);
  };

  // Debug overlay (only in development)
  const showDebugHeader = process.env.NODE_ENV === 'development';

  return (
    <div className="flex flex-col h-full bg-background">
      {showDebugHeader && <DebugHeader debugState={debugPanel} />}
      <AskSageContent
        messages={messages}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onSubmit={handleFormSubmit}
        onClearHistory={handleClearHistory}
        isMessageSending={isMessageSending}
        canSendMessages={canSendMessages}
        voiceParam={voiceParam}
        onFeedback={handleFeedbackAdapter}
      />
    </div>
  );
};

export default AskSageContainer;

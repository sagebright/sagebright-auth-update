
import React from 'react';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { AuthRequiredUI } from './AuthRequiredUI';
import { LoadingUI } from './LoadingUI';
import { OrgRecoveryUI } from './OrgRecoveryUI';
import { HydrationUI } from './HydrationUI';
import { AskSageContent } from './AskSageContent';
import { DebugHeader } from './DebugHeader';
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
    
    // Context and hydration state
    isRecoveringOrg,
    
    // Messaging
    messages,
    handleFeedback,
    
    // Voice parameters
    voiceParam,
    
    // Debug
    debugPanel,
    
    // Additional state from useAskSagePage that we need to extract
    isContextReady,
    isReadyToRender,
    isSessionReady,
    isOrgReady,
    isVoiceReady,
    blockers,
    sendMessageToSage,
    handleSelectQuestion
  } = useAskSagePage();

  // Add additional state that might be missing
  const canInteract = isAuthenticated && isContextReady && !authLoading;
  const shouldRender = isReadyToRender;
  const contextHydration = {
    hydration: {
      isLoading: !isContextReady,
      progressPercent: 
        (([isSessionReady, isOrgReady, isVoiceReady].filter(Boolean).length / 3) * 100),
      completedSteps: [
        isSessionReady ? 'session' : '',
        isOrgReady ? 'org' : '',
        isVoiceReady ? 'voice' : ''
      ].filter(Boolean),
      totalSteps: 3,
      timedOut: false
    },
    blockers
  };
  
  // State for input and form handling
  const [inputValue, setInputValue] = React.useState('');
  const isMessageSending = false; // This would come from a real hook
  const canSendMessages = isContextReady;
  
  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && canSendMessages) {
      sendMessageToSage(inputValue);
      setInputValue('');
    }
  };
  
  const handleClearHistory = () => {
    console.log('Clearing chat history');
    // Implementation would go here
  };

  // Force boolean type for isRecoveringOrg to resolve TypeScript error
  const isRecoveringOrgBoolean: boolean = Boolean(isRecoveringOrg);

  // Check if loading states should be displayed
  if (!shouldRender || authLoading) {
    return <LoadingUI state={contextHydration} />;
  }

  // Organization recovery UI
  if (isRecoveringOrgBoolean) {
    return <OrgRecoveryUI />;
  }

  // Show hydration UI if context is loading or timed out
  if (contextHydration.hydration.isLoading || contextHydration.hydration.timedOut) {
    return <HydrationUI 
      state={contextHydration}
      progress={contextHydration.hydration.progressPercent}
      blockers={blockers}
      completedSteps={contextHydration.hydration.completedSteps}
    />;
  }

  // Auth check - show login UI if not authenticated
  if (!isAuthenticated || !userId || !orgId) {
    return <AuthRequiredUI />;
  }

  // Adapting feedback types between different parts of the application
  const handleFeedbackAdapter = (messageId: string, feedback: 'like' | 'dislike'): void => {
    // Map 'like'/'dislike' to 'positive'/'negative' for backend compatibility
    const adaptedFeedback: FeedbackType = 
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
        onSubmit={sendMessageToSage}
        onFormSubmit={handleFormSubmit}
        onClearHistory={handleClearHistory}
        isMessageSending={isMessageSending}
        canSendMessages={canSendMessages}
        voiceParam={voiceParam}
        onFeedback={handleFeedbackAdapter}
        canInteract={canInteract}
        isProtected={false}
      />
    </div>
  );
};

export default AskSageContainer;

// Also export as named export for consistency
export { AskSageContainer };

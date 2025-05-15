
import React, { useState } from 'react';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { useSageContainerState } from '@/hooks/ask-sage/use-sage-container-state';
import { useNavigate } from 'react-router-dom';
import { AuthRequiredUI } from '@/components/ask-sage/AuthRequiredUI';
import { LoadingUI } from '@/components/ask-sage/LoadingUI';
import DebugPanel from '@/components/debug/DebugPanel';
import { HydrationUI } from '@/components/ask-sage/HydrationUI';
import { AskSageContent } from '@/components/ask-sage/AskSageContent';
import { DebugHeader } from '@/components/ask-sage/DebugHeader';
import { FeedbackType } from '@/types/chat';
import { SageContentLayout } from './SageContentLayout';

export const AskSageContainer: React.FC = () => {
  const navigate = useNavigate();
  const askSageState = useAskSagePage();
  const containerState = useSageContainerState();
  
  // Get container state variables with proper error handling
  const {
    canInteract = false,
    shouldRender = false,
    isRedirectAllowed = true,
    contextHydration = { hydration: { progressPercent: 0 } },
    showLoading = true,
    voiceParamState = { currentVoice: 'default', source: 'default' }
  } = containerState;
  
  // State from the main hook
  const {
    userId,
    orgId,
    isAuthenticated,
    authLoading,
    messages,
    sendMessageToSage,
    handleSelectQuestion,
    debugPanel,
    isContextReady,
    isSessionStable,
    sidebarOpen = false,
    setSidebarOpen = () => {},
    isLoading = false,
    suggestedQuestions = []
  } = askSageState;
  
  // Local state for input value
  const [inputValue, setInputValue] = useState('');
  const isMessageSending = false;
  
  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessageToSage(inputValue);
      setInputValue('');
    }
  };
  
  const handleClearHistory = () => {
    console.log('Clear history clicked');
    // Implement clear history functionality
  };
  
  // Adapt the feedback type to match what's expected by the component
  const handleFeedback = (messageId: string, feedback: FeedbackType) => {
    // Convert legacy feedback types to the format expected by askSageState.handleFeedback
    let normalizedFeedback: 'positive' | 'negative';
    if (feedback === 'like' || feedback === 'positive') {
      normalizedFeedback = 'positive';
    } else {
      normalizedFeedback = 'negative';
    }
    askSageState.handleFeedback(messageId, normalizedFeedback);
  };

  const canSendMessages = isContextReady && isSessionStable;
  
  // If not authenticated, show login UI
  if (!isAuthenticated && !authLoading && isRedirectAllowed) {
    return <AuthRequiredUI />;
  }
  
  // If loading, show loading UI
  if (showLoading || authLoading) {
    return <LoadingUI state={contextHydration} />;
  }
  
  // If hydration is in progress, show hydration UI
  if (!shouldRender && !isContextReady) {
    return <HydrationUI state={contextHydration} />;
  }

  // Show default development debug panel in development environment
  const showDebugPanel = process.env.NODE_ENV === 'development';
  
  return (
    <>
      <SageContentLayout 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isProtected={false}
        voiceParam={voiceParamState?.currentVoice || null}
        voiceSource={voiceParamState?.source || 'unknown'}
        isSessionStable={isSessionStable || true}
        canSendMessages={canSendMessages}
        messages={messages}
        isLoading={isLoading}
        suggestedQuestions={suggestedQuestions}
        handleSelectQuestion={handleSelectQuestion}
        sendMessageToSage={sendMessageToSage}
        handleReflectionSubmit={askSageState.handleReflectionSubmit}
        handleFeedback={handleFeedback}
        isContextReady={isContextReady}
        showWelcomeMessage={askSageState.showWelcomeMessage || false}
        canInteract={canInteract}
        isOrgReady={askSageState.isOrgReady || false}
      />
      
      {/* Only show debug panel in development environment */}
      {showDebugPanel && debugPanel?.isDev && (
        <DebugPanel />
      )}
    </>
  );
};

export default AskSageContainer;

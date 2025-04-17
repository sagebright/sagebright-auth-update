
import React from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { AskSageReflectionDialog } from '@/components/ask-sage/AskSageReflectionDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { SageLoadingStates } from '@/components/ask-sage/loading/SageLoadingStates';
import { SageContentLayout } from '@/components/ask-sage/SageContentLayout';
import { useSageContainerState } from '@/hooks/ask-sage/use-sage-container-state';

export const AskSageContainer: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Use our custom hook for container state management
  const {
    voiceParamState,
    sageContext,
    canInteract,
    shouldRender,
    isProtected,
    contextHydration,
    userId,
    orgId,
    canSendMessages
  } = useSageContainerState();
  
  // Use the main page logic hook
  const {
    authLoading,
    isAuthenticated,
    isContextReady,
    sessionUserReady,
    isSessionStable,
    
    sidebarOpen,
    setSidebarOpen,
    isRecoveryVisible,
    
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    
    handleReflectionSubmit,
    sendMessageToSage,
    handleSelectQuestion,
    handleFeedback,
    
    isRecoveringOrg,
    voiceParam,
    showWelcomeMessage,
    
    debugPanel
  } = useAskSagePage();

  // Render loading states
  const loadingElement = (
    <SageLoadingStates 
      authLoading={authLoading}
      userId={userId}
      orgId={orgId}
      isProtected={isProtected}
      canInteract={canInteract}
      isRecoveringOrg={isRecoveringOrg}
      contextHydration={contextHydration}
      shouldRender={shouldRender}
    />
  );
  
  // If we should show a loading state, return it
  if (loadingElement) {
    return loadingElement;
  }

  return (
    <DashboardContainer showSagePanel={false}>
      <SageContentLayout 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isProtected={isProtected}
        voiceParam={voiceParam}
        voiceSource={voiceParamState.source}
        isSessionStable={isSessionStable}
        canSendMessages={canSendMessages}
        messages={messages}
        isLoading={isLoading}
        suggestedQuestions={suggestedQuestions}
        handleSelectQuestion={handleSelectQuestion}
        sendMessageToSage={sendMessageToSage}
        handleReflectionSubmit={handleReflectionSubmit}
        handleFeedback={handleFeedback}
        isContextReady={isContextReady}
        showWelcomeMessage={showWelcomeMessage}
        canInteract={canInteract}
        isOrgReady={!!orgId}
      />

      <AskSageReflectionDialog 
        showReflection={showReflection} 
        setShowReflection={setShowReflection}
        handleReflectionSubmit={handleReflectionSubmit}
        isMobile={isMobile}
      />
      
      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </DashboardContainer>
  );
};

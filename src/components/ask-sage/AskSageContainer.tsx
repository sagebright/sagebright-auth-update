import React, { useEffect } from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { AskSageReflectionDialog } from '@/components/ask-sage/AskSageReflectionDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { SageLoadingStates } from '@/components/ask-sage/loading/SageLoadingStates';
import { SageContentLayout } from '@/components/ask-sage/SageContentLayout';
import { useSageContainerState } from '@/hooks/ask-sage/use-sage-container-state';

export const AskSageContainer: React.FC = () => {
  useEffect(() => {
    console.log("🏗️ AskSageContainer component mounted");
  }, []);

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
  
  // Log context hydration status for debugging
  useEffect(() => {
    if (contextHydration?.hydration?.progressPercent === 100) {
      console.log("🧠 Live Sage context:", contextHydration.backendContext);
    }
  }, [contextHydration?.hydration?.progressPercent, contextHydration.backendContext]);
  
  console.log("🧩 AskSageContainer state:", {
    hasContext: !!sageContext.context,
    contextLoading: sageContext.loading,
    hasError: !!sageContext.error,
    userId,
    orgId,
    canInteract,
    shouldRender,
    isProtected,
    canSendMessages,
    hydrationProgress: contextHydration?.hydration?.progressPercent || 0,
    backendFetched: !contextHydration.backendContext.isLoading && !contextHydration.backendContext.error
  });
  
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

  // Ensure isRecoveringOrg is treated as a boolean
  // This approach makes TypeScript explicitly understand we're enforcing a boolean type
  const isRecoveringOrgBoolean = Boolean(isRecoveringOrg === true);

  // Check if loading states should be displayed
  if (!shouldRender || authLoading || !canInteract) {
    return (
      <SageLoadingStates 
        authLoading={authLoading}
        userId={userId}
        orgId={orgId}
        isProtected={isProtected}
        canInteract={canInteract}
        isRecoveringOrg={isRecoveringOrgBoolean}
        contextHydration={contextHydration}
        shouldRender={shouldRender}
      />
    );
  }

  console.log("✅ AskSageContainer rendering full UI");
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

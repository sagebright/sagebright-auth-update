
import React, { useEffect, useState, useRef } from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { AskSageReflectionDialog } from '@/components/ask-sage/AskSageReflectionDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { SageLoadingStates } from '@/components/ask-sage/loading/SageLoadingStates';
import { SageContentLayout } from '@/components/ask-sage/SageContentLayout';
import { useSageContainerState } from '@/hooks/ask-sage/use-sage-container-state';

export const AskSageContainer: React.FC = () => {
  // Track if the component is truly mounted to prevent post-mount state updates
  const hasRenderedRef = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (hasRenderedRef.current) return;
    
    hasRenderedRef.current = true;
    console.log("🏗️ AskSageContainer component mounted");
    
    // Only set initialized state once
    setIsInitialized(true);
    
    return () => {
      console.log("🏗️ AskSageContainer component unmounted");
      hasRenderedRef.current = false;
    };
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
  
  // Only log state on mount or when renderCount changes
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log("🧩 AskSageContainer state:", {
      hasContext: !!sageContext.context,
      contextLoading: sageContext.loading,
      hasError: !!sageContext.error,
      userId,
      orgId,
      canInteract,
      shouldRender,
      isProtected,
      canSendMessages
    });
  }, [isInitialized, sageContext, userId, orgId, canInteract, shouldRender, isProtected, canSendMessages]);
  
  // Use the main page logic hook - wrap in a memoized component to prevent re-renders
  const askSagePageState = useAskSagePage();
  
  // If any dependencies change that require a re-render, compute the loading element
  const loadingElement = React.useMemo(() => {
    if (!canInteract || !shouldRender || !isInitialized) {
      return (
        <SageLoadingStates 
          authLoading={askSagePageState.authLoading}
          userId={userId}
          orgId={orgId}
          isProtected={isProtected}
          canInteract={canInteract}
          isRecoveringOrg={askSagePageState.isRecoveringOrg}
          contextHydration={contextHydration}
          shouldRender={shouldRender}
        />
      );
    }
    return null;
  }, [
    canInteract, 
    shouldRender, 
    isInitialized,
    askSagePageState.authLoading,
    userId,
    orgId,
    isProtected,
    askSagePageState.isRecoveringOrg,
    contextHydration
  ]);
  
  // If we should show a loading state, return it
  if (loadingElement) {
    return loadingElement;
  }

  console.log("✅ AskSageContainer rendering full UI");
  return (
    <DashboardContainer showSagePanel={false}>
      <SageContentLayout 
        sidebarOpen={askSagePageState.sidebarOpen}
        setSidebarOpen={askSagePageState.setSidebarOpen}
        isProtected={isProtected}
        voiceParam={askSagePageState.voiceParam}
        voiceSource={voiceParamState.source}
        isSessionStable={askSagePageState.isSessionStable}
        canSendMessages={canSendMessages}
        messages={askSagePageState.messages}
        isLoading={askSagePageState.isLoading}
        suggestedQuestions={askSagePageState.suggestedQuestions}
        handleSelectQuestion={askSagePageState.handleSelectQuestion}
        sendMessageToSage={askSagePageState.sendMessageToSage}
        handleReflectionSubmit={askSagePageState.handleReflectionSubmit}
        handleFeedback={askSagePageState.handleFeedback}
        isContextReady={askSagePageState.isContextReady}
        showWelcomeMessage={askSagePageState.showWelcomeMessage}
        canInteract={canInteract}
        isOrgReady={!!orgId}
      />

      <AskSageReflectionDialog 
        showReflection={askSagePageState.showReflection} 
        setShowReflection={askSagePageState.setShowReflection}
        handleReflectionSubmit={askSagePageState.handleReflectionSubmit}
        isMobile={isMobile}
      />
      
      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </DashboardContainer>
  );
};

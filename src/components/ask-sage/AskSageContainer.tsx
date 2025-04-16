
import React, { useEffect } from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { useLocation } from 'react-router-dom';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { LoadingUI } from '@/components/ask-sage/LoadingUI';
import { AuthRequiredUI } from '@/components/ask-sage/AuthRequiredUI';
import { OrgRecoveryUI } from '@/components/ask-sage/OrgRecoveryUI';
import { LoadingSage } from '@/components/ask-sage/LoadingSage';
import { AskSageContent } from '@/components/ask-sage/AskSageContent';
import { AskSageReflectionDialog } from '@/components/ask-sage/AskSageReflectionDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { useAskSageGuard } from '@/hooks/ask-sage/use-ask-sage-guard';

export const AskSageContainer: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const voiceParamState = useVoiceParamState();
  const { captureIntent } = useRedirectIntentManager();
  
  // Use the unified Ask Sage Guard for route, session and context protection
  const { 
    canInteract, 
    shouldRender, 
    isRedirectAllowed, 
    readinessBlockers,
    isProtected,
    showLoading
  } = useAskSageGuard();
  
  const {
    userId,
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

  const { orgId } = useAuth();

  // Preserve voice parameters
  useEffect(() => {
    if (voiceParamState.isValid && voiceParamState.currentVoice !== 'default') {
      console.log(`📝 Preserving voice parameter ${voiceParamState.currentVoice} for /ask-sage`);
      
      captureIntent(
        '/ask-sage',
        'user-initiated',
        {
          voiceParam: voiceParamState.currentVoice,
          source: 'ask_sage_protection',
          timestamp: Date.now(),
          context: 'page_load_protection'
        },
        60
      );
    }
  }, [captureIntent, voiceParamState.currentVoice, voiceParamState.isValid]);

  // Render decisions based on protection, session, and auth state
  if (!shouldRender) {
    if (isProtected) {
      console.log('🛡️ Ask Sage under protection - showing loading state');
      return <LoadingSage reason="initialization" />;
    }
    
    if (!canInteract) {
      console.warn('🚧 Ask Sage not ready. Blockers:', readinessBlockers);
      return <LoadingSage reason="context_loading" />;
    }
    
    return null;
  }

  // Authentication flow
  if (authLoading) return <LoadingUI />;
  if (!authLoading && !userId) return <AuthRequiredUI />;
  if (!authLoading && userId && !orgId && !isRecoveringOrg) return <OrgRecoveryUI />;

  return (
    <DashboardContainer showSagePanel={false}>
      <div className="flex flex-col h-full -m-4 md:-m-8">
        <ChatHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          isProtected={isProtected}
        />

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-secondary/10 px-4 py-1 text-xs text-charcoal">
            🎤 Voice: <strong>{voiceParam}</strong> | Source: <strong>{voiceParamState.source}</strong>
            {!voiceParam && (
              <span className="text-accent1"> (Missing voice param!)</span>
            )}
            <span className="ml-2">
              🔒 Session: <strong>{isSessionStable ? 'Stable' : 'Unstable'}</strong>
            </span>
            {isProtected && (
              <span className="ml-2 text-primary font-medium">
                🛡️ Protection Active
              </span>
            )}
          </div>
        )}

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
          />

          {isContextReady && sidebarOpen && (
            <div className="hidden md:flex flex-col w-80 border-l border-border bg-background p-4 overflow-y-auto">
              <ResourcesSidebar />
            </div>
          )}
        </div>

        <AskSageReflectionDialog 
          showReflection={showReflection} 
          setShowReflection={setShowReflection}
          handleReflectionSubmit={handleReflectionSubmit}
          isMobile={isMobile}
        />
        
        {process.env.NODE_ENV === 'development' && <DebugPanel />}
      </div>
    </DashboardContainer>
  );
};

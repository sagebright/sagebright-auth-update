
import React from 'react';
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

export const AskSageContainer: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const {
    userId,
    authLoading,
    isAuthenticated,
    isContextReady,
    sessionUserReady,
    
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

  // Only wait for basic auth checks, not full current user data
  if (authLoading) {
    return <LoadingUI />;
  }

  // Check if user exists at all (even without full currentUser data)
  if (!authLoading && !userId) {
    return <AuthRequiredUI />;
  }

  // Check if organization context is missing
  if (!authLoading && userId && !orgId && !isRecoveringOrg) {
    return <OrgRecoveryUI />;
  }

  // Check if context is ready before rendering the page content
  if (!isContextReady) {
    return <LoadingSage />;
  }

  return (
    <DashboardContainer showSagePanel={false}>
      <div className="flex flex-col h-full -m-4 md:-m-8">
        <ChatHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-secondary/10 px-4 py-1 text-xs text-charcoal">
            🎤 Voice: <strong>{voiceParam}</strong> | {location.search}
            {!voiceParam && (
              <span className="text-accent1"> (Missing voice param!)</span>
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
        
        {/* Add Debug Panel */}
        <DebugPanel />
      </div>
    </DashboardContainer>
  );
};

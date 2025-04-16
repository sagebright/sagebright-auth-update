
import React, { useEffect } from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { ChatMessage } from '@/components/ask-sage/ChatMessage';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { TypingIndicator } from '@/components/ask-sage/TypingIndicator';
import { ReflectionForm } from '@/components/ask-sage/ReflectionForm';
import { LoadingSage } from '@/components/ask-sage/LoadingSage';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { useAuth } from '@/contexts/auth/AuthContext';
import { LoadingUI } from '@/components/ask-sage/LoadingUI'; 
import { AuthRequiredUI } from '@/components/ask-sage/AuthRequiredUI';
import { OrgRecoveryUI } from '@/components/ask-sage/OrgRecoveryUI';

const AskSage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const {
    userId,
    authLoading,
    isAuthenticated,
    isOrgReady,
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
    
    debugPanel
  } = useAskSagePage();

  const isReady = sessionUserReady && isOrgReady && !authLoading;

  useEffect(() => {
    console.log("[Sage Init] Readiness check:", {
      sessionUserReady,
      isOrgReady,
      authLoading,
      isReady,
      location: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [sessionUserReady, isOrgReady, authLoading, isReady, location.pathname]);

  if (!isReady) {
    return <LoadingSage />;
  }

  const { user, currentUser, orgId, orgSlug } = useAuth(); // Add direct access to auth context
  
  useEffect(() => {
    console.log("[Sage Init] AskSage component mounted with context:", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      voiceParam,
      timestamp: new Date().toISOString()
    });
    
    console.log("[Sage Init] Window location:", {
      href: window.location.href,
      search: window.location.search,
      voiceFromWindowSearch: new URLSearchParams(window.location.search).get('voice')
    });
    
    // Log auth state in AskSage to verify what's available
    console.log("[Sage Init] AskSage user metadata check:", {
      hasSessionUser: !!user,
      hasUserMetadata: user ? !!user.user_metadata : false,
      hasCurrentUser: !!currentUser,
      userId,
      orgId,
      orgSlug,
      voiceParam,
      timestamp: new Date().toISOString(),
      sessionUserReady: !!user,
      currentUserReady: !!currentUser
    });
  }, [location, voiceParam, user, userId, orgId, orgSlug, currentUser]);

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
    return <OrgRecoveryUI />; // Remove the userId prop since it's not expected
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
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    onFeedback={handleFeedback} 
                  />
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            </div>

            <div className="flex-shrink-0">
              <ChatInputBar 
                onSendMessage={sendMessageToSage} 
                onReflectionSubmit={handleReflectionSubmit}
                isLoading={isLoading}
                suggestedQuestions={suggestedQuestions}
                onSelectQuestion={handleSelectQuestion}
              />
            </div>
          </div>

          {sidebarOpen && (
            <div className="hidden md:flex flex-col w-80 border-l border-border bg-background p-4 overflow-y-auto">
              <ResourcesSidebar />
            </div>
          )}
        </div>

        <Dialog open={showReflection} onOpenChange={setShowReflection}>
          <DialogContent className={isMobile ? "w-full h-[90vh] rounded-t-lg p-4 max-w-full pt-6" : ""}>
            <DialogHeader>
              <DialogTitle className="text-xl font-helvetica text-charcoal">Want to check in with yourself?</DialogTitle>
              <DialogDescription>
                Taking a moment to reflect can help your onboarding journey.
              </DialogDescription>
            </DialogHeader>
            <ReflectionForm
              onSubmit={handleReflectionSubmit}
              onCancel={() => setShowReflection(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Add Debug Panel */}
        <DebugPanel />
      </div>
    </DashboardContainer>
  );
};

export default AskSage;

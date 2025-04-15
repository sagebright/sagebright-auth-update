
import React, { useEffect } from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { ChatMessage } from '@/components/ask-sage/ChatMessage';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { TypingIndicator } from '@/components/ask-sage/TypingIndicator';
import { ReflectionForm } from '@/components/ask-sage/ReflectionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import { AuthRequiredUI } from '@/components/ask-sage/AuthRequiredUI';
import { OrgRecoveryUI } from '@/components/ask-sage/OrgRecoveryUI';
import { LoadingUI } from '@/components/ask-sage/LoadingUI';
import { useAskSagePage } from '@/hooks/use-ask-sage-page';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { DebugPanel } from '@/components/debug/DebugPanel';

const AskSage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user } = useAuth(); // Add direct access to auth context
  
  const {
    userId,
    orgId,
    authLoading,
    isAuthenticated,
    
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

  useEffect(() => {
    console.log("🔍 AskSage route location:", {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      voiceParam
    });
    
    console.log("🌐 Window location:", {
      href: window.location.href,
      search: window.location.search,
      voiceFromWindowSearch: new URLSearchParams(window.location.search).get('voice')
    });
    
    // Log auth state in AskSage to verify what's available
    console.log("👤 AskSage user metadata check:", {
      hasSessionUser: !!user,
      hasUserMetadata: user ? !!user.user_metadata : false,
      userId,
      orgId,
      voiceParam
    });
  }, [location, voiceParam, user, userId, orgId]);

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

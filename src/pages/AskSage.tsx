
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { ChatMessage } from '@/components/ask-sage/ChatMessage';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { TypingIndicator } from '@/components/ask-sage/TypingIndicator';
import { ReflectionForm, ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/hooks/use-chat';
import { toast } from "@/components/ui/use-toast";
import { syncUserRole } from '@/lib/syncUserRole';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

const AskSage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userId, orgId, loading: authLoading } = useRequireAuth(navigate);
  const isMobile = useIsMobile();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Get voice parameter from searchParams
  const voiceParam = React.useMemo(() => {
    return searchParams.get('voice') || 'default';
  }, [searchParams]);

  // Log auth state when component loads
  useEffect(() => {
    console.log("🔒 AskSage auth state:", { 
      authenticated: !!user, 
      userId, 
      orgId,
      loading: authLoading 
    });
  }, [user, userId, orgId, authLoading]);

  const {
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    handleSendMessage,
    handleFeedback
  } = useChat();

  const handleReflectionSubmit = (data: ReflectionData) => {
    console.log('Reflection submitted:', data);
    setShowReflection(false);
  };

  // Attempt to recover org context by triggering role sync
  const handleRecoverOrgContext = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Cannot recover without user ID. Please log out and back in."
      });
      return;
    }

    setIsRecovering(true);
    try {
      // Try to force sync the user role
      console.log("🔄 Attempting to recover org context for user ID:", userId);
      await syncUserRole(userId);
      
      // Force refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      toast({
        title: "Recovery Attempted",
        description: "Please wait a moment while we reload the page..."
      });
      
      // Give a moment for the toast to show before reloading
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error recovering org context:", error);
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: "Unable to recover organization context. Try logging out and back in."
      });
    } finally {
      setIsRecovering(false);
    }
  };

  // Send message using the useChat hook
  const sendMessageToSage = async (content: string) => {
    if (!userId || !orgId) {
      console.error("❌ Cannot send message - missing userId or orgId", { userId, orgId });
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please ensure you're logged in with an organization."
      });
      return;
    }

    console.log("📝 Sending message to Sage:", { content, userId, orgId });
    try {
      await handleSendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Message Error",
        description: "Failed to send your message. Please try again.",
      });
    }
  };

  const handleSelectQuestion = (question: string) => {
    console.log("Selected suggested question:", question);
    sendMessageToSage(question);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Checking authentication...</span>
      </div>
    );
  }

  // Add additional check for userId and orgId
  if (!authLoading && (!userId || !orgId)) {
    console.error("⚠️ User authenticated but missing userId or orgId:", { userId, orgId });
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <div className="text-red-500 text-3xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Authentication Issue</h2>
        <p className="mb-4">Your user account is not properly linked to an organization.</p>
        <div className="space-y-4">
          <Button 
            onClick={handleRecoverOrgContext}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            disabled={isRecovering}
          >
            {isRecovering ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                Recovering...
              </>
            ) : (
              "Try to Recover"
            )}
          </Button>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => navigate('/user-dashboard')}
              variant="outline"
              className="px-4 py-2 rounded"
            >
              Return to Dashboard
            </Button>
            
            <Button 
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/auth/login');
              }}
              variant="secondary"
              className="px-4 py-2 rounded"
            >
              Sign Out and Login Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardContainer showSagePanel={false}>
      <div className="flex flex-col h-full -m-4 md:-m-8">
        {/* Chat Header */}
        <ChatHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          {/* Main chat area */}
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

            {/* Chat input */}
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

          {/* Resources sidebar */}
          {sidebarOpen && (
            <div className="hidden md:flex flex-col w-80 border-l border-border bg-background p-4 overflow-y-auto">
              <ResourcesSidebar />
            </div>
          )}
        </div>

        {/* Reflection dialog */}
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
      </div>
    </DashboardContainer>
  );
};

export default AskSage;

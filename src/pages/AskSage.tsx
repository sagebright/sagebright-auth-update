
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
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

const AskSage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userId, loading: authLoading } = useRequireAuth(navigate);
  const isMobile = useIsMobile();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  
  // Get voice parameter from searchParams
  const voiceParam = React.useMemo(() => {
    return searchParams.get('voice') || 'default';
  }, [searchParams]);

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

  // Send message using the useChat hook
  const sendMessageToSage = async (content: string) => {
    if (!userId) {
      console.error("❌ Cannot send message - missing userId");
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please ensure you're logged in to use Sage."
      });
      return;
    }

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Error signing out',
        description: 'Failed to sign out. Please try again.'
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2 text-primary">Checking authentication...</span>
      </div>
    );
  }

  // If the user is authenticated but doesn't have the expected data
  // Show a simpler authentication error instead of the full recovery UI
  if (!authLoading && !userId) {
    return (
      <div className="container mx-auto max-w-md py-16 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">You need to be logged in to use Sage.</p>
          <Button onClick={() => navigate('/auth/login')} className="w-full">
            Go to Login
          </Button>
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

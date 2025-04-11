
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
import { Loader2 } from "lucide-react";

const AskSage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userId, orgId, loading: authLoading } = useRequireAuth(navigate);
  const isMobile = useIsMobile();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  
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
    handleFeedback,
    isRecoveringOrg
  } = useChat();

  useEffect(() => {
    // Show recovery dialog if user is authenticated but missing org context
    if (!authLoading && userId && !orgId && !isRecoveringOrg) {
      setIsRecoveryVisible(true);
    } else {
      setIsRecoveryVisible(false);
    }
  }, [userId, orgId, authLoading, isRecoveringOrg]);

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

    if (!orgId) {
      console.error("❌ Cannot send message - missing orgId");
      toast({
        variant: "destructive",
        title: "Organization Error",
        description: "Your account is not linked to an organization. Try the 'Try to Recover' option."
      });
      setIsRecoveryVisible(true);
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

  const handleTryRecover = async () => {
    setIsRecovering(true);
    try {
      console.log("🔄 Manually attempting recovery of organization context");
      
      // Try to refresh session first
      await supabase.auth.refreshSession();
      
      // Try to get user from database
      const { data, error } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("❌ Error fetching user data:", error);
        throw new Error("Failed to fetch user data");
      }
      
      if (data?.org_id) {
        console.log("✅ Found org_id in database:", data.org_id);
        
        // Update user metadata with org_id
        const { error: updateError } = await supabase.auth.updateUser({
          data: { org_id: data.org_id }
        });
        
        if (updateError) {
          console.error("❌ Error updating user metadata:", updateError);
          throw new Error("Failed to update user metadata");
        }
        
        // Force refresh session to get updated metadata
        await supabase.auth.refreshSession();
        
        toast({
          title: "Recovery Successful",
          description: "Your organization context has been restored."
        });
        
        // Reload the page to pick up the new org context
        window.location.reload();
      } else {
        console.error("❌ No org_id found for user in database");
        throw new Error("No organization found for your account");
      }
    } catch (error) {
      console.error("Recovery error:", error);
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: "Unable to recover your organization context. Please contact support."
      });
    } finally {
      setIsRecovering(false);
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

  // Show recovery UI if user is missing organization context
  if (!authLoading && userId && !orgId && !isRecoveringOrg) {
    return (
      <div className="container mx-auto max-w-md py-16 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Account Recovery Required</h2>
          <p className="mb-6">Your account needs to be connected to an organization to use Sage.</p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleTryRecover} 
              className="w-full" 
              disabled={isRecovering}
            >
              {isRecovering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recovering...
                </>
              ) : (
                'Try to Recover'
              )}
            </Button>
            
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full"
              disabled={isRecovering}
            >
              Sign Out
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

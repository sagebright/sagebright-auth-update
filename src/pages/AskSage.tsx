
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { ChatMessage, Message } from '@/components/ask-sage/ChatMessage';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { TypingIndicator } from '@/components/ask-sage/TypingIndicator';
import { ReflectionForm, ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/hooks/use-chat';
import { buildSageContext } from "@/lib/buildSageContext";
import { callOpenAI } from "@/lib/api";

const AskSage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userId, orgId, loading: authLoading } = useRequireAuth(navigate);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    suggestedQuestions,
    showReflection,
    setShowReflection,
    handleFeedback
  } = useChat();

  // Get voice parameter from searchParams
  const voiceParam = React.useMemo(() => {
    return searchParams.get('voice') || 'default';
  }, [searchParams]);

  // Log the current voice setting and search params to help with debugging
  useEffect(() => {
    console.log("🎤 Current voice setting:", voiceParam);
    console.log("🔍 Search params:", Object.fromEntries(searchParams.entries()));
  }, [voiceParam, searchParams]);

  // Add initial greeting from Sage when the component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome-message',
        sender: 'sage',
        content: "Hi there! I'm Sage, your onboarding assistant. How can I help you today?",
        timestamp: new Date(),
        avatar_url: '/lovable-uploads/sage_avatar.png',
      }]);
    }
  }, [messages.length]);

  const sendMessageToSage = async (content: string) => {
    if (!content.trim() || !userId || !orgId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
      avatar_url: user?.user_metadata?.avatar_url,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { context } = await buildSageContext(userId, orgId);
      console.log("🧠 Sage Context:\n", context);
      
      const answer = await callOpenAI({ 
        question: content, 
        context, 
        voice: voiceParam 
      });

      const sageMessage: Message = {
        id: `sage-${Date.now()}`,
        sender: 'sage',
        content: answer,
        timestamp: new Date(),
        avatar_url: "/lovable-uploads/sage_avatar.png",
      };

      setMessages(prev => [...prev, sageMessage]);
    } catch (err) {
      console.error("Sage had trouble:", err);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: 'sage',
        content: "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
        avatar_url: "/lovable-uploads/sage_avatar.png",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflectionSubmit = (data: ReflectionData) => {
    console.log('Reflection submitted:', data);
    setShowReflection(false);
  };

  const handleSelectQuestion = (question: string) => {
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

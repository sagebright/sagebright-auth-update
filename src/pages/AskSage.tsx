
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ChatMessage } from '@/components/ask-sage/ChatMessage';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { ReflectionForm, ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { TypingIndicator } from '@/components/ask-sage/TypingIndicator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/hooks/use-chat';
import { buildSageContext } from "@/lib/buildSageContext";
import { callOpenAI } from "@/lib/api";
import { useRequireAuth } from '@/hooks/useRequireAuth';

const AskSage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, userId, orgId, loading: authLoading } = useRequireAuth(navigate);

  const [demoMessages, setDemoMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const {
    suggestedQuestions,
    showReflection,
    setShowReflection,
    handleSendMessage,
    handleFeedback
  } = useChat();

  // Get voice parameter from searchParams instead of location.search
  const voiceParam = React.useMemo(() => {
    return searchParams.get('voice') || 'default';
  }, [searchParams]);

  // Log the current voice setting and search params to help with debugging
  useEffect(() => {
    console.log("🎤 Current voice setting:", voiceParam);
    console.log("🔍 Search params:", Object.fromEntries(searchParams.entries()));
  }, [voiceParam, searchParams]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [demoMessages, isTyping]);

  const sendMessageToSage = async (question: string) => {
    if (!userId || !orgId) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: question,
      timestamp: new Date(),
      avatar_url: user?.user_metadata?.avatar_url || "",
    };

    setDemoMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const { context } = await buildSageContext(userId, orgId);
      console.log("🧠 Sage Context:\n", context);
      // Use the preserved voice parameter from state
      const answer = await callOpenAI({ question, context, voice: voiceParam });    

      const sageMessage = {
        id: `sage-${Date.now()}`,
        sender: "sage",
        content: answer,
        timestamp: new Date(),
        avatar_url: "/lovable-uploads/sage_avatar.png",
      };

      setDemoMessages((prev) => [...prev, sageMessage]);
    } catch (err) {
      console.error("Sage had trouble:", err);
      const errorMsg = {
        id: `error-${Date.now()}`,
        sender: "sage",
        content: "Sage couldn't respond. Try again.",
        timestamp: new Date(),
        avatar_url: "/lovable-uploads/sage_avatar.png",
      };
      setDemoMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReflectionSubmit = (data: ReflectionData) => {
    console.log('Reflection submitted:', data);
    setShowReflection(false);
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-sagebright-green border-t-transparent rounded-full"></div>
        <span className="ml-2 text-sagebright-green">Checking authentication...</span>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        
        <ChatHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {demoMessages.length > 0 ? (
                  demoMessages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onFeedback={handleFeedback}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p>Start a conversation with Sage</p>
                  </div>
                )}

                {isTyping && <TypingIndicator />}

                <div ref={chatEndRef} />
              </div>
            </div>

            <ChatInputBar
              onSendMessage={sendMessageToSage}
              onReflectionSubmit={handleReflectionSubmit}
              isLoading={isTyping}
              suggestedQuestions={suggestedQuestions}
              onSelectQuestion={handleSendMessage}
            />
          </div>

          {sidebarOpen && (
            <div className="hidden md:flex flex-col w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
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
      </div>
    </DashboardLayout>
  );
};

export default AskSage;

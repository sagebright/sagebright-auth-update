
import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ChatHeader } from '@/components/ask-sage/ChatHeader';
import { ChatMessage } from '@/components/ask-sage/ChatMessage';
import { ChatInputBar } from '@/components/ask-sage/ChatInputBar';
import { SuggestedQuestions } from '@/components/ask-sage/SuggestedQuestions';
import { ReflectionForm, ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { ResourcesSidebar } from '@/components/ask-sage/ResourcesSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/hooks/use-chat';
import { useState } from 'react';

const AskSage = () => {
  const { 
    messages, 
    suggestedQuestions, 
    showReflection, 
    setShowReflection, 
    handleSendMessage, 
    handleFeedback 
  } = useChat();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleReflectionSubmit = (data: ReflectionData) => {
    console.log('Reflection submitted:', data);
    setShowReflection(false);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Top Greeting Card (optional sticky) */}
        <ChatHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Main Chat Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
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
                <div ref={chatEndRef} />
              </div>
              
              {/* Suggested Questions section */}
              {messages.length < 3 && (
                <SuggestedQuestions 
                  questions={suggestedQuestions}
                  onSelectQuestion={handleSendMessage}
                />
              )}
            </div>
            
            {/* Input Bar (Sticky at Bottom) */}
            <ChatInputBar
              onSendMessage={handleSendMessage}
              onReflectionSubmit={handleReflectionSubmit}
            />
          </div>
          
          {/* Sidebar (Desktop) */}
          {sidebarOpen && (
            <div className="hidden md:flex flex-col w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
              <ResourcesSidebar />
            </div>
          )}
        </div>
        
        {/* Reflection Modal */}
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

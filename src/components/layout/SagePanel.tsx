
import React, { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { SageAvatar } from '../conversation/SageAvatar';
import { ConversationContainer } from '../conversation/ConversationContainer';
import { ChatBubbleProps } from '../conversation/ChatBubble';

interface SagePanelProps {
  className?: string;
}

// Memoized SagePanel component to prevent unnecessary re-renders
export const SagePanel = React.memo(function SagePanel({ className }: SagePanelProps) {
  // Example conversation - in a real app, this would come from a context or prop
  const [messages, setMessages] = useState<Omit<ChatBubbleProps, "avatarFallback">[]>([
    {
      sender: 'sage',
      content: 'Hi there! I\'m Sage, your onboarding assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 60000 * 5),
      avatarUrl: '/lovable-uploads/sage_avatar.png',
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  
  // Memoize the header to prevent unnecessary re-renders
  const headerContent = useMemo(() => (
    <div className="p-4 flex items-center gap-3">
      <SageAvatar size="md" />
      <div>
        <h3 className="font-medium text-sm">Sage</h3>
        <p className="text-xs text-muted-foreground">Your personal assistant</p>
      </div>
    </div>
  ), []);
  
  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage = {
      sender: 'user' as const,
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate Sage's response after a delay
    setTimeout(() => {
      const sageMessage = {
        sender: 'sage' as const,
        content: `I received your message: "${message}". This is a placeholder response from Sage.`,
        timestamp: new Date(),
        avatarUrl: '/lovable-uploads/sage_avatar.png',
      };
      
      setMessages((prev) => [...prev, sageMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ConversationContainer 
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        sageAvatarUrl="/lovable-uploads/sage_avatar.png"
        headerSlot={headerContent}
      />
    </div>
  );
});

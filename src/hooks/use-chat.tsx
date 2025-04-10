
import { useState, useEffect } from 'react';
import { Message } from '@/components/ask-sage/ChatMessage';
import { buildSageContext } from '@/lib/buildSageContext';
import { callOpenAI } from '@/lib/api';
import { useAuth } from "@/contexts/auth/AuthContext";
import { toast } from '@/components/ui/use-toast';

// Updated suggested questions order to prioritize the two required questions
const SUGGESTED_QUESTIONS = [
  "Who's who on my team",
  "How to set up my development environment", 
  "What high performers here do differently",
  "How I can add value right away",
  "Our team's biggest goals right now"
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showReflection, setShowReflection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId, orgId, currentUser } = useAuth();

  // Add initial greeting from Sage if empty chat
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: "Hi there! I'm Sage, your onboarding assistant. How can I help you today?",
          sender: 'sage',
          timestamp: new Date(),
          avatar_url: '/lovable-uploads/sage_avatar.png',
        }
      ]);
    }
  }, []);

  // Randomly prompt for reflection after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 1 && !showReflection && Math.random() > 0.7) {
        setShowReflection(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [messages, showReflection]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !userId || !orgId) {
      console.log("Missing content, userId or orgId:", { content, userId, orgId });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      avatar_url: currentUser?.avatar_url,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log("Building context for userId:", userId, "orgId:", orgId);
      const { context } = await buildSageContext(userId, orgId);
      console.log("Context built:", context);
      
      // Get voice from URL or use default
      const voice = new URLSearchParams(window.location.search).get('voice') || 'default';
      console.log("Using voice:", voice);
      
      const answer = await callOpenAI({ 
        question: content, 
        context, 
        voice 
      });
      console.log("Received answer from OpenAI");

      const sageMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: answer,
        sender: 'sage',
        timestamp: new Date(),
        avatar_url: "/lovable-uploads/sage_avatar.png",
      };

      setMessages(prev => [...prev, sageMessage]);
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'sage',
        timestamp: new Date(),
        avatar_url: "/lovable-uploads/sage_avatar.png",
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          liked: feedback === 'like' ? true : false,
          disliked: feedback === 'dislike' ? true : false,
        };
      }
      return message;
    }));
  };

  return {
    messages,
    suggestedQuestions: SUGGESTED_QUESTIONS,
    showReflection,
    setShowReflection,
    handleSendMessage,
    handleFeedback,
    isLoading
  };
};

import { useState, useEffect } from 'react';
import { Message } from '@/components/ask-sage/ChatMessage';
import { buildSageContext } from '@/lib/knowledge';
import { callOpenAI } from '@/lib/api';
import { useAuth } from "@/contexts/AuthContext";


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

  // Add initial greeting from Sage if empty chat
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: "Welcome back! You're doing the work — I'm just here to help make it smoother. What do you want to explore next?",
          sender: 'sage',
          timestamp: new Date(),
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
    if (!content.trim()) return;
  
    const { profile } = useAuth();
    console.log("🧔 Avatar check:", profile?.avatar_url);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      avatar_url: profile?.avatar_url,
    };
  
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
  
    try {
      const context = await buildSageContext("69d925ed-ced1-4d6e-a88a-3de3f6dc2c76", "lumon"); // or however you're injecting user/org ID
      const reply = await callOpenAI({ question: content, context });
  
      const sageMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: reply,
        sender: 'sage',
        timestamp: new Date(),
        avatar_url: "/images/sage_avatar.png", // optional
      };
  
      setMessages(prev => [...prev, sageMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sage couldn't respond. Try again.",
        sender: 'sage',
        timestamp: new Date(),
      };
  
      setMessages(prev => [...prev, errorMessage]);
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

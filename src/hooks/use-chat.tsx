
import { useState, useEffect } from 'react';
import { Message } from '@/components/ask-sage/ChatMessage';

// Updated suggested questions order to prioritize the two required questions
const SUGGESTED_QUESTIONS = [
  "Who's who on my team",
  "What high performers here do differently",
  "How to set up my development environment", 
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
          content: "Welcome back, Adam! You're doing the work — I'm just here to help make it smoother. What do you want to explore next?",
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

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate Sage response
    setTimeout(() => {
      const sageResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getSageResponse(content),
        sender: 'sage',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, sageResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getSageResponse = (query: string): string => {
    // Default comprehensive response for most questions
    if (query.toLowerCase().includes('high performer') || query.toLowerCase().includes('values')) {
      return "That's a great question! Company-wide, high performers really do live out our core values: Own the Outcome, Earn Trust Every Day, and Build with Purpose. On your engineering team, owning the outcome might look like making sure you have 85% test coverage. Earning trust might mean giving clear, actionable feedback in a code review. Building with purpose might mean taking time in a sprint demo to focus on why you're building a feature.";
    }
    
    // Simple response generator for demonstration
    if (query.toLowerCase().includes('pto') || query.toLowerCase().includes('time off')) {
      return "Great question! PTO policies can be found in the Employee Handbook under Benefits (Section 3.2). The basics: you have 15 days annually, accrued monthly. Your manager needs at least 2 weeks notice for extended time off. Need more details?";
    }
    
    if (query.toLowerCase().includes('benefit') || query.toLowerCase().includes('insurance')) {
      return "For benefits questions, Kim from HR is your go-to person! She holds office hours Tuesdays and Thursdays from 1-3pm. The benefits portal can be accessed through your employee dashboard. Would you like me to send you a direct link?";
    }
    
    if (query.toLowerCase().includes('focus') || query.toLowerCase().includes('this week')) {
      return "Based on your onboarding plan, this week you should focus on: 1) Completing your security training, 2) Setting up 1:1s with your team members, and 3) Reviewing the Q3 product roadmap. How's that sound?";
    }
    
    return "That's a great question! Company-wide, high performers really do live out our core values: Own the Outcome, Earn Trust Every Day, and Build with Purpose. On your engineering team, owning the outcome might look like making sure you have 85% test coverage. Earning trust might mean giving clear, actionable feedback in a code review. Building with purpose might mean taking time in a sprint demo to focus on why you're building a feature.";
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

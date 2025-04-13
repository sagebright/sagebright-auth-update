import { useState, useEffect, useRef } from 'react';
import { Message } from '@/components/ask-sage/ChatMessage';
import { buildSageContext } from '@/lib/buildSageContext';
import { callOpenAI } from '@/lib/api';
import { useAuth } from "@/contexts/auth/AuthContext";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

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
  const [isRecoveringOrg, setIsRecoveringOrg] = useState(false);
  const [hasRecoveredOrgId, setHasRecoveredOrgId] = useState(false);
  const { userId, orgId, currentUser, isAuthenticated } = useAuth();

  console.log("🔍 useChat hook initializing with", { userId, orgId, isAuthenticated });
  
  useEffect(() => {
    if (isAuthenticated && userId && !orgId && !isRecoveringOrg && !hasRecoveredOrgId) {
      const fetchOrgData = async () => {
        setIsRecoveringOrg(true);
        try {
          console.log("🔍 Trying to fetch missing org ID from users table");
          
          const { data: sessionData } = await supabase.auth.getSession();
          const metadataOrgId = sessionData?.session?.user?.user_metadata?.org_id;
          
          if (metadataOrgId) {
            console.log("✅ Found org ID in user metadata:", metadataOrgId);
            setIsRecoveringOrg(false);
            setHasRecoveredOrgId(true);
            return;
          }
          
          const { data, error } = await supabase
            .from('users')
            .select('org_id')
            .eq('id', userId)
            .single();
            
          if (error) {
            console.warn("⚠️ Error fetching user org data:", error);
            setIsRecoveringOrg(false);
            setHasRecoveredOrgId(true);
            return;
          }
          
          if (data?.org_id) {
            console.log("✅ Found org ID in database:", data.org_id);
            
            await supabase.auth.updateUser({
              data: { org_id: data.org_id }
            });
            
            await supabase.auth.refreshSession();
            console.log("✅ Updated user metadata with org_id and refreshed session");
          } else {
            console.warn("⚠️ No org ID found for user");
          }
        } catch (err) {
          console.error("❌ Error recovering org data:", err);
        } finally {
          setIsRecoveringOrg(false);
          setHasRecoveredOrgId(true);
        }
      };
      
      fetchOrgData();
    }
  }, [userId, orgId, isAuthenticated, isRecoveringOrg, hasRecoveredOrgId]);
  
  useEffect(() => {
    if (messages.length === 0) {
      if (!userId) {
        console.warn("⚠️ User authenticated but missing userId:", { userId });
        return;
      }
      
      if (!isRecoveringOrg) {
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
    }
  }, [messages.length, userId, isRecoveringOrg]);

  useEffect(() => {
    if (!userId) return;
    
    const timer = setTimeout(() => {
      if (messages.length > 1 && !showReflection && Math.random() > 0.7) {
        setShowReflection(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [messages, showReflection, userId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      console.log("Empty message content, not sending");
      return;
    }

    if (!userId) {
      console.error("❌ Missing userId, user might not be authenticated", { userId });
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You need to be logged in to use Sage. Please sign in and try again."
      });
      return;
    }

    if (!orgId) {
      console.error("❌ Missing orgId. User might not be linked to an organization", { userId, orgId });
      toast({
        variant: "destructive",
        title: "Organization Error",
        description: "Your account is not linked to an organization. Try signing out and back in, or contact support."
      });
      return;
    }
    
    console.log("✅ Sending message with context:", { content, userId, orgId });

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
      
      if (!context.org?.name) {
        console.error("❌ Critical context missing: Organization name is required", { 
          userId, 
          orgId, 
          context,
          orgFields: context.org ? Object.keys(context.org) : []
        });
        
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Incomplete Organization Data",
          description: "Unable to personalize Sage's responses. Please contact support to complete your organization profile."
        });
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, but I don't have enough information about your organization to properly assist you. Please contact support to complete your organization profile.",
          sender: 'sage',
          timestamp: new Date(),
          avatar_url: "/lovable-uploads/sage_avatar.png",
        };
        
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      
      if (context.user && !context.user.role) {
        console.error("❌ Critical context missing: User role is required", { 
          userId, 
          orgId, 
          context,
          userFields: context.user ? Object.keys(context.user) : []
        });
        
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Incomplete User Profile",
          description: "Unable to personalize Sage's responses. Please contact support to complete your user profile."
        });
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, but I don't have enough information about your role to properly assist you. Please contact support to complete your user profile.",
          sender: 'sage',
          timestamp: new Date(),
          avatar_url: "/lovable-uploads/sage_avatar.png",
        };
        
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      
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
    isLoading,
    isRecoveringOrg
  };
};

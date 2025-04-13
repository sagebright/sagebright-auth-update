
import { useState, useEffect } from 'react';
import { Message, ChatHookReturn } from '@/types/chat';
import { useAuth } from "@/contexts/auth/AuthContext";
import { SUGGESTED_QUESTIONS } from '@/data/suggestedQuestions';
import { useOrgRecovery } from './use-org-recovery';
import { useFeedback } from './use-feedback';
import { useSendMessage } from './use-send-message';
import { useReflection } from './use-reflection';
import { createSageMessage } from '@/utils/messageUtils';

export const useChat = (debugPanel?: ReturnType<typeof import('./use-debug-panel').useDebugPanel>): ChatHookReturn => {
  const { userId, orgId, user, currentUser, isAuthenticated } = useAuth();
  const { isRecoveringOrg } = useOrgRecovery(userId, orgId, isAuthenticated);
  
  // Initialize feedback system
  const { messages, setMessages, handleFeedback } = useFeedback([]);
  
  // Initialize reflection system
  const { showReflection, setShowReflection } = useReflection(userId, messages.length);
  
  // Initialize message sending system with debug panel options
  const { isLoading, handleSendMessage } = useSendMessage(
    messages,
    setMessages,
    userId,
    orgId,
    user || currentUser, // Use whatever user data is available
    debugPanel ? {
      setRequestLoading: debugPanel.setRequestLoading,
      setRequestSuccess: debugPanel.setRequestSuccess,
      setRequestError: debugPanel.setRequestError
    } : undefined
  );

  // Log comprehensive auth state for debugging
  console.log("✅ Final Sage auth context:", {
    userId,
    orgId,
    role: user?.user_metadata?.role || currentUser?.role || 'unknown',
    hasSessionMetadata: user ? !!user.user_metadata : false,
    hasCurrentUser: !!currentUser,
    isAuthenticated
  });
  
  // Add initial greeting message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      if (!userId) {
        console.warn("⚠️ User authenticated but missing userId:", { userId });
        return;
      }
      
      if (!isRecoveringOrg) {
        const welcomeMessage = createSageMessage(
          "Hi there! I'm Sage, your onboarding assistant. How can I help you today?"
        );
        setMessages([welcomeMessage]);
      }
    }
  }, [messages.length, userId, isRecoveringOrg, setMessages]);

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

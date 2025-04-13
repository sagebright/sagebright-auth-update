
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useChat } from '@/hooks/use-chat';
import { ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { useVoiceParam } from '@/hooks/use-voice-param';
import { useDebugPanel } from '@/hooks/use-debug-panel';

export const useAskSagePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userId, orgId, loading: authLoading, isAuthenticated } = useRequireAuth(navigate);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  const [pageInitialized, setPageInitialized] = useState(false);
  
  // Use our custom hook to get the voice parameter
  const voiceParam = useVoiceParam();
  
  // Get debug panel state and functions
  const debugPanel = useDebugPanel();
  
  useEffect(() => {
    console.log("🎤 AskSagePage current voice parameter:", voiceParam);
  }, [voiceParam]);

  // Modify useChat to pass debug panel options
  const {
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    handleSendMessage,
    handleFeedback,
    isRecoveringOrg
  } = useChat(debugPanel);

  // Initialize page after auth is done loading (only need basic auth, not full currentUser)
  useEffect(() => {
    if (!authLoading && isAuthenticated && !pageInitialized) {
      // Mark the page as initialized to prevent repeated initialization
      setPageInitialized(true);
      
      // Log authentication state for debugging
      console.log("🔍 AskSage page initialized with auth state:", { 
        userId, 
        orgId, 
        isRecoveringOrg,
        hasSessionMetadata: user ? !!user.user_metadata : false,
        voiceParam
      });
    }
  }, [authLoading, isAuthenticated, userId, orgId, isRecoveringOrg, pageInitialized, voiceParam, user]);

  // Show recovery dialog if user is authenticated but missing org context
  useEffect(() => {
    if (pageInitialized && userId && !orgId && !isRecoveringOrg) {
      console.log("⚠️ Missing org context, showing recovery dialog");
      setIsRecoveryVisible(true);
    } else if (pageInitialized) {
      setIsRecoveryVisible(false);
    }
  }, [userId, orgId, authLoading, isRecoveringOrg, pageInitialized]);

  const handleReflectionSubmit = (data: ReflectionData) => {
    console.log('Reflection submitted:', data);
    setShowReflection(false);
  };

  // Send message using the useChat hook
  const sendMessageToSage = useCallback(async (content: string) => {
    if (!userId) {
      console.error("❌ Cannot send message - missing userId");
      return;
    }

    if (!orgId) {
      console.error("❌ Cannot send message - missing orgId");
      setIsRecoveryVisible(true);
      return;
    }

    try {
      await handleSendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [userId, orgId, handleSendMessage]);

  const handleSelectQuestion = useCallback((question: string) => {
    console.log("Selected suggested question:", question);
    sendMessageToSage(question);
  }, [sendMessageToSage]);

  return {
    // Auth state
    user,
    userId,
    orgId,
    authLoading,
    isAuthenticated,
    
    // UI state
    sidebarOpen,
    setSidebarOpen,
    isRecoveryVisible,
    
    // Chat state
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    
    // Handlers
    handleReflectionSubmit,
    sendMessageToSage,
    handleSelectQuestion,
    handleFeedback,
    
    // Other
    isRecoveringOrg,
    voiceParam,
    
    // Debug panel
    debugPanel
  };
};

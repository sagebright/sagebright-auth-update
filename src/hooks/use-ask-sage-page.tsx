
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useChat } from '@/hooks/use-chat';
import { ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { useVoiceParam } from '@/hooks/use-voice-param';
import { useDebugPanel } from '@/hooks/use-debug-panel';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/use-sage-context-readiness';
import { toast } from '@/components/ui/use-toast';

export const useAskSagePage = () => {
  console.group('🌟 Ask Sage Page Initialization');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    user, 
    userId, 
    orgId, 
    orgSlug,
    loading: authLoading, 
    isAuthenticated 
  } = useRequireAuth(navigate);
  
  const { currentUser: currentUserData } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  const [pageInitialized, setPageInitialized] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  const sessionUserReady = !!user;
  
  // Get voice parameter first so we can pass it to the context readiness hook
  const voiceParam = useVoiceParam();
  console.log('🎤 Voice parameter detected:', voiceParam);
  
  // Use the enhanced hook with the voice parameter
  const { 
    isContextReady, 
    contextCheckComplete, 
    missingContext,
    blockers,
    isReadyToRender,
    isSessionReady,
    isOrgReady,
    isVoiceReady,
    readySince
  } = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    authLoading,
    sessionUserReady,
    voiceParam
  );
  
  const debugPanel = useDebugPanel();

  useEffect(() => {
    console.log("🔍 Context readiness from useSageContextReadiness:", {
      isContextReady,
      contextCheckComplete,
      missingContext,
      isReadyToRender,
      blockers,
      readySince: readySince ? new Date(readySince).toISOString() : null,
      timestamp: new Date().toISOString()
    });
  }, [isContextReady, contextCheckComplete, missingContext, isReadyToRender, blockers, readySince]);

  useEffect(() => {
    console.log("🌐 Current URL state:", { 
      pathname: window.location.pathname,
      search: window.location.search,
      href: window.location.href,
      historyLength: window.history.length
    });
  }, []);

  const {
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    handleSendMessage,
    handleFeedback,
    isRecoveringOrg
  } = useChat(debugPanel, isContextReady);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !pageInitialized) {
      setPageInitialized(true);
      
      console.log("🚀 AskSage page initialized with auth state:", { 
        userId, 
        orgId, 
        isRecoveringOrg,
        hasSessionMetadata: user ? !!user.user_metadata : false,
        voiceParam,
        urlSearch: window.location.search,
        timestamp: new Date().toISOString()
      });
    }
  }, [authLoading, isAuthenticated, userId, orgId, isRecoveringOrg, pageInitialized, voiceParam, user]);

  useEffect(() => {
    setShowWelcomeMessage(messages.length === 0);
  }, [messages.length]);

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

  const sendMessageToSage = useCallback(async (content: string) => {
    if (!isContextReady) {
      console.error("❌ Cannot send message - context not ready:", {
        blockers,
        isReadyToRender,
        isSessionReady,
        isOrgReady,
        isVoiceReady
      });
      
      const blockerMessage = blockers.length > 0 
        ? blockers.join(', ') 
        : "Unknown issue with session data";
      
      toast({
        variant: "destructive",
        title: "Sage isn't quite ready",
        description: `Please wait a moment: ${blockerMessage}`,
      });
      return;
    }

    console.log("🚀 Sending message with context:", {
      userId,
      orgId,
      hasSessionUser: !!user,
      hasUserMetadata: user ? !!user.user_metadata : false,
      isContextReady,
      readySince: readySince ? new Date(readySince).toISOString() : null
    });

    try {
      await handleSendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Message Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, [userId, orgId, handleSendMessage, user, isContextReady, blockers, isReadyToRender, isSessionReady, isOrgReady, isVoiceReady, readySince]);

  const handleSelectQuestion = useCallback((question: string) => {
    console.log("Selected suggested question:", question);
    sendMessageToSage(question);
  }, [sendMessageToSage]);

  console.groupEnd();

  return {
    user,
    userId,
    orgId,
    authLoading,
    isAuthenticated,
    
    sidebarOpen,
    setSidebarOpen,
    isRecoveryVisible,
    showWelcomeMessage,
    
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    
    handleReflectionSubmit,
    sendMessageToSage,
    handleSelectQuestion,
    handleFeedback,
    
    isRecoveringOrg,
    voiceParam,
    
    debugPanel,
    isContextReady,
    sessionUserReady,
    
    // Enhanced readiness flags
    isReadyToRender,
    isSessionReady,
    isOrgReady,
    isVoiceReady,
    blockers,
    readySince
  };
};

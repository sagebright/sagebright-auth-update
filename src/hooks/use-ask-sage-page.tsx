
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
    console.log("[Sage Init] Context readiness from useSageContextReadiness:", {
      isContextReady,
      contextCheckComplete,
      missingContext,
      isReadyToRender,
      blockers,
      timestamp: new Date().toISOString()
    });
  }, [isContextReady, contextCheckComplete, missingContext, isReadyToRender, blockers]);

  useEffect(() => {
    console.log("🎤 AskSagePage voice parameter (timestamp: %s): %s", 
                new Date().toISOString(), 
                voiceParam);
    console.log("🌐 Current URL state:", { 
      pathname: window.location.pathname,
      search: window.location.search,
      href: window.location.href,
      historyLength: window.history.length
    });
  }, [voiceParam]);

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
      
      console.log("[Sage Init] AskSage page initialized with auth state:", { 
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
      console.error("❌ Cannot send message - context not ready");
      toast({
        variant: "destructive",
        title: "Sage isn't quite ready",
        description: "Please wait a moment while we load your session data.",
      });
      return;
    }

    console.log("[Sage Init] Preparing to send message with context:", {
      userId,
      orgId,
      hasSessionUser: !!user,
      hasUserMetadata: user ? !!user.user_metadata : false,
      isContextReady,
      blockers
    });

    try {
      await handleSendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [userId, orgId, handleSendMessage, user, isContextReady, blockers]);

  const handleSelectQuestion = useCallback((question: string) => {
    console.log("Selected suggested question:", question);
    sendMessageToSage(question);
  }, [sendMessageToSage]);

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
    
    // Add additional readiness flags for more granular control
    isReadyToRender,
    isSessionReady,
    isOrgReady,
    isVoiceReady,
    blockers
  };
};

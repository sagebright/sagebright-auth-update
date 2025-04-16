import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useChat } from '@/hooks/use-chat';
import { ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { useVoiceParam } from '@/hooks/use-voice-param';
import { useDebugPanel } from '@/hooks/use-debug-panel';
import { useAuth } from '@/contexts/auth/AuthContext';

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
  
  // Get currentUser from AuthContext directly 
  const { currentUser: currentUserData } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  const [pageInitialized, setPageInitialized] = useState(false);
  
  // Context readiness check
  const isOrgReady = !!orgSlug && !!currentUserData && !!orgId;
  const sessionUserReady = !!user;
  
  // Use our custom hooks
  const voiceParam = useVoiceParam();
  const debugPanel = useDebugPanel();

  // Log context readiness state
  useEffect(() => {
    console.log("[Sage Init] Context readiness check:", {
      isOrgReady,
      sessionUserReady,
      hasOrgSlug: !!orgSlug,
      hasCurrentUserData: !!currentUserData,
      hasOrgId: !!orgId,
      timestamp: new Date().toISOString()
    });

    if (!orgSlug) console.warn("[Sage Init] ⚠️ orgSlug missing");
    if (!currentUserData) console.warn("[Sage Init] ⚠️ currentUserData missing");
    if (!orgId) console.warn("[Sage Init] ⚠️ orgId missing");
  }, [orgSlug, currentUserData, orgId, isOrgReady, sessionUserReady]);

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

  // Modify useChat to pass context readiness
  const {
    messages,
    isLoading,
    suggestedQuestions,
    showReflection,
    setShowReflection,
    handleSendMessage,
    handleFeedback,
    isRecoveringOrg
  } = useChat(debugPanel, isOrgReady);

  // Initialize page after auth is done loading (only need basic auth, not full currentUser)
  useEffect(() => {
    if (!authLoading && isAuthenticated && !pageInitialized) {
      // Mark the page as initialized to prevent repeated initialization
      setPageInitialized(true);
      
      // Log authentication state for debugging with timestamps
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

    console.log("[Sage Init] Preparing to send message with context:", {
      userId,
      orgId,
      hasSessionUser: !!user,
      hasUserMetadata: user ? !!user.user_metadata : false
    });

    try {
      await handleSendMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [userId, orgId, handleSendMessage, user, setIsRecoveryVisible]);

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
    debugPanel,
    isOrgReady,
    sessionUserReady,
  };
};

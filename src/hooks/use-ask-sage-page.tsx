
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useChat } from '@/hooks/use-chat';
import { ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { getVoiceFromUrl } from '@/lib/utils';

export const useAskSagePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, userId, orgId, loading: authLoading, isAuthenticated } = useRequireAuth(navigate);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecoveryVisible, setIsRecoveryVisible] = useState(false);
  const [pageInitialized, setPageInitialized] = useState(false);
  
  // Track the most recent valid search string
  const latestSearchRef = useRef(location.search);
  
  // Update the ref whenever search changes and is not empty
  useEffect(() => {
    if (location.search) {
      console.log("🔄 AskSagePage updating latest search ref:", location.search);
      latestSearchRef.current = location.search;
    }
  }, [location.search]);
  
  // Get voice parameter from current location or the latest stored value
  const voiceParam = getVoiceFromUrl(location.search || latestSearchRef.current);
  
  useEffect(() => {
    console.log("🎤 Current voice parameter:", voiceParam);
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
  } = useChat();

  // Initialize page after auth is done loading
  useEffect(() => {
    if (!authLoading && isAuthenticated && !pageInitialized) {
      // Mark the page as initialized to prevent repeated initialization
      setPageInitialized(true);
      
      // Log authentication state for debugging
      console.log("🔍 AskSage page initialized with auth state:", { 
        userId, 
        orgId, 
        isRecoveringOrg,
        currentSearch: location.search || latestSearchRef.current,
        voiceParam
      });
    }
  }, [authLoading, isAuthenticated, userId, orgId, isRecoveringOrg, pageInitialized, location.search, voiceParam]);

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
    voiceParam
  };
};

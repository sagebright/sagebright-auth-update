
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useChat } from '@/hooks/use-chat';
import { useVoiceParam } from '@/hooks/use-voice-param';
import { useDebugPanel } from '@/hooks/use-debug-panel';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/sage-context';
import { useSageUIState } from '@/hooks/ask-sage/use-sage-ui-state';
import { useReflectionHandler } from '@/hooks/ask-sage/use-reflection-handler';
import { useQuestionSelection } from '@/hooks/ask-sage/use-question-selection';
import { useContextMonitor } from '@/hooks/ask-sage/use-context-monitor';
import { useSageMessenger } from '@/hooks/ask-sage/use-sage-messenger';

export const useAskSagePage = () => {
  // Use ref to prevent excessive logging
  const hasLoggedRef = useRef(false);
  
  // Only log once on initial load
  useEffect(() => {
    if (!hasLoggedRef.current) {
      console.group('🌟 Ask Sage Page Initialization');
      hasLoggedRef.current = true;
    }
    
    return () => {
      console.groupEnd();
    };
  }, []);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Auth context
  const { 
    user, 
    userId, 
    orgId, 
    orgSlug,
    loading: authLoading, 
    isAuthenticated 
  } = useRequireAuth(navigate);
  
  const { currentUser: currentUserData } = useAuth();
  const sessionUserReady = !!user;
  
  // Debug panel
  const debugPanel = useDebugPanel();
  
  // Voice parameter context
  const voiceParam = useVoiceParam();
  
  // Use ref for initialization state to reduce render triggers
  const pageInitializedRef = useRef(false);
  const [pageInitialized, setPageInitialized] = useState(false);
  
  // Context readiness - use stable references to prevent re-renders
  const stableUserId = useRef(userId).current;
  const stableOrgId = useRef(orgId).current;
  const stableOrgSlug = useRef(orgSlug).current;
  
  // Context readiness with memoized parameters
  const contextReadiness = useSageContextReadiness(
    stableUserId,
    stableOrgId,
    stableOrgSlug,
    currentUserData,
    authLoading,
    sessionUserReady,
    voiceParam
  );
  
  // Chat functionality - memoize the isContextReady to prevent re-renders
  const isContextReadyStable = useRef(contextReadiness.isContextReady);
  
  // Only update the stable ref when the value actually changes
  useEffect(() => {
    if (isContextReadyStable.current !== contextReadiness.isContextReady) {
      isContextReadyStable.current = contextReadiness.isContextReady;
    }
  }, [contextReadiness.isContextReady]);
  
  // Use the stable ref value for the chat hook
  const {
    messages,
    isLoading,
    suggestedQuestions,
    handleSendMessage,
    handleFeedback,
    isRecoveringOrg
  } = useChat(debugPanel, isContextReadyStable.current);
  
  // UI state hooks
  const uiState = useSageUIState(messages);
  
  // Reflection handler
  const reflectionHandler = useReflectionHandler();
  
  // Context monitoring - use stable references
  useContextMonitor(
    contextReadiness,
    isAuthenticated,
    userId,
    orgId,
    isRecoveringOrg,
    user,
    voiceParam,
    pageInitialized,
    uiState.setIsRecoveryVisible
  );
  
  // Message sending - wrap in a stable reference
  const stableSendMessageArgs = useMemo(() => ({
    userId,
    orgId,
    handleSendMessage,
    user,
    contextReadiness
  }), [userId, orgId, handleSendMessage, user, contextReadiness.isContextReady, contextReadiness.isSessionStable]);
  
  const { sendMessageToSage } = useSageMessenger(
    stableSendMessageArgs.userId,
    stableSendMessageArgs.orgId,
    stableSendMessageArgs.handleSendMessage,
    stableSendMessageArgs.user,
    stableSendMessageArgs.contextReadiness
  );
  
  // Question selection - memoize to prevent re-renders
  const { handleSelectQuestion } = useQuestionSelection(sendMessageToSage);
  
  // Page initialization effect - use ref to prevent re-renders
  useEffect(() => {
    if (!authLoading && isAuthenticated && !pageInitializedRef.current) {
      pageInitializedRef.current = true;
      setPageInitialized(true);
    }
  }, [authLoading, isAuthenticated]);

  // Memoize the return value to prevent creating new object references on every render
  return useMemo(() => ({
    // Auth context
    user,
    userId,
    orgId,
    authLoading,
    isAuthenticated,
    
    // UI state
    ...uiState,
    
    // Chat state
    messages,
    isLoading,
    suggestedQuestions,
    ...reflectionHandler,
    
    // Message handlers
    sendMessageToSage,
    handleSelectQuestion,
    handleFeedback,
    
    // Context state
    isRecoveringOrg,
    voiceParam,
    
    // Debug and readiness
    debugPanel,
    isContextReady: contextReadiness.isContextReady,
    sessionUserReady,
    
    // Detailed readiness flags
    isReadyToRender: contextReadiness.isReadyToRender,
    isSessionReady: contextReadiness.isSessionReady,
    isOrgReady: contextReadiness.isOrgReady,
    isVoiceReady: contextReadiness.isVoiceReady,
    isSessionStable: contextReadiness.isSessionStable,
    blockers: contextReadiness.blockers,
    readySince: contextReadiness.readySince
  }), [
    user, userId, orgId, authLoading, isAuthenticated,
    uiState,
    messages, isLoading, suggestedQuestions, reflectionHandler,
    sendMessageToSage, handleSelectQuestion, handleFeedback,
    isRecoveringOrg, voiceParam,
    debugPanel, contextReadiness, sessionUserReady
  ]);
};

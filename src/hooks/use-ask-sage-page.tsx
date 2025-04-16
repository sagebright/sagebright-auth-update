
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useChat } from '@/hooks/use-chat';
import { useVoiceParam } from '@/hooks/use-voice-param';
import { useDebugPanel } from '@/hooks/use-debug-panel';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/use-sage-context-readiness';
import { useSageUIState } from '@/hooks/ask-sage/use-sage-ui-state';
import { useReflectionHandler } from '@/hooks/ask-sage/use-reflection-handler';
import { useQuestionSelection } from '@/hooks/ask-sage/use-question-selection';
import { useContextMonitor } from '@/hooks/ask-sage/use-context-monitor';
import { useSageMessenger } from '@/hooks/ask-sage/use-sage-messenger';

export const useAskSagePage = () => {
  console.group('🌟 Ask Sage Page Initialization');
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
  console.log('🎤 Voice parameter detected:', voiceParam);
  
  // UI state management
  const [pageInitialized, setPageInitialized] = useState(false);
  
  // Context readiness
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    authLoading,
    sessionUserReady,
    voiceParam
  );
  
  // Chat functionality
  const {
    messages,
    isLoading,
    suggestedQuestions,
    handleSendMessage,
    handleFeedback,
    isRecoveringOrg
  } = useChat(debugPanel, contextReadiness.isContextReady);
  
  // UI state hooks
  const uiState = useSageUIState(messages);
  
  // Reflection handler
  const reflectionHandler = useReflectionHandler();
  
  // Context monitoring
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
  
  // Message sending
  const { sendMessageToSage } = useSageMessenger(
    userId,
    orgId,
    handleSendMessage,
    user,
    contextReadiness
  );
  
  // Question selection
  const { handleSelectQuestion } = useQuestionSelection(sendMessageToSage);
  
  // Page initialization effect
  useEffect(() => {
    if (!authLoading && isAuthenticated && !pageInitialized) {
      setPageInitialized(true);
    }
  }, [authLoading, isAuthenticated, pageInitialized]);
  
  console.groupEnd();

  return {
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
  };
};

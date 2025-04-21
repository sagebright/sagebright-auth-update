
import { useEffect, useRef, useCallback } from 'react';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { useContextHydration } from '@/hooks/sage-context';
import { useSageContext } from '@/hooks/sage-context';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAskSageGuard } from '@/hooks/ask-sage/use-ask-sage-guard';

export function useSageContainerState() {
  // Use ref for isMounted to prevent it from causing re-renders
  const isMountedRef = useRef(true);
  const previousStateRef = useRef<{
    canInteract?: boolean;
    shouldRender?: boolean;
    isReadyToSend?: boolean;
  }>({});
  
  const voiceParamState = useVoiceParamState();
  const { captureIntent } = useRedirectIntentManager();
  
  // Get context from the centralized hook
  const sageContext = useSageContext();
  
  // Use the unified Ask Sage Guard for route, session and context protection
  const { 
    canInteract, 
    shouldRender, 
    isRedirectAllowed, 
    readinessBlockers,
    isProtected,
    showLoading
  } = useAskSageGuard();
  
  // Use the enhanced context hydration system with our new context
  const contextHydration = useContextHydration(
    voiceParamState.currentVoice,
    sageContext.userContext,
    sageContext.orgContext
  );
  
  const { userId, orgId } = useAuth();

  // Memoize canSendMessages to prevent it from changing on every render
  const canSendMessages = contextHydration.isReadyToSend;
  
  // Log state changes only when they actually change
  useEffect(() => {
    const currentState = {
      canInteract,
      shouldRender,
      isReadyToSend: contextHydration.isReadyToSend
    };
    
    const hasChanged = 
      previousStateRef.current.canInteract !== canInteract ||
      previousStateRef.current.shouldRender !== shouldRender ||
      previousStateRef.current.isReadyToSend !== contextHydration.isReadyToSend;
    
    if (hasChanged) {
      console.log("🔄 AskSage container state changed:", currentState);
      previousStateRef.current = currentState;
    }
  }, [canInteract, shouldRender, contextHydration.isReadyToSend]);

  // Preserve voice parameters - use useCallback to stabilize this function
  const preserveVoiceParameter = useCallback(() => {
    if (!isMountedRef.current) return;
    
    if (voiceParamState.isValid && voiceParamState.currentVoice !== 'default') {
      console.log(`📝 Preserving voice parameter ${voiceParamState.currentVoice} for /ask-sage`);
      
      captureIntent(
        '/ask-sage',
        'user-initiated',
        {
          voiceParam: voiceParamState.currentVoice,
          source: 'ask_sage_protection',
          timestamp: Date.now(),
          context: 'page_load_protection'
        },
        60
      );
    }
  }, [captureIntent, voiceParamState.currentVoice, voiceParamState.isValid]);
  
  // Call preserveVoiceParameter only once after mount
  useEffect(() => {
    preserveVoiceParameter();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [preserveVoiceParameter]);

  return {
    voiceParamState,
    sageContext,
    canInteract,
    shouldRender,
    isRedirectAllowed,
    readinessBlockers,
    isProtected,
    showLoading,
    contextHydration,
    userId,
    orgId,
    canSendMessages
  };
}

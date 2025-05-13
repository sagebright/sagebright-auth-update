
import { useEffect } from 'react';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { useSageContext } from '@/hooks/sage-context';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAskSageGuard } from '@/hooks/ask-sage/use-ask-sage-guard';

export function useSageContainerState() {
  const isMounted = true;
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
    showLoading,
    contextHydration
  } = useAskSageGuard();
  
  const { userId, orgId } = useAuth();

  // Force canSendMessages to true after timeout even if not fully ready
  // Also allow sending if either the user or org context is a fallback
  const canSendMessages = contextHydration.isReadyToSend || 
                           contextHydration.hydration.timedOut || 
                           sageContext.error || // Allow sending if there was an API error
                           sageContext.timedOut || // Allow sending if there was a timeout
                           (contextHydration.backendContext.userContext?._fallback === true) ||
                           (contextHydration.backendContext.orgContext?._fallback === true);

  // Preserve voice parameters
  useEffect(() => {
    if (!isMounted) return;
    
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
  }, [captureIntent, voiceParamState.currentVoice, voiceParamState.isValid, isMounted]);

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
    canSendMessages,
    hasTimedOut: contextHydration.hydration.timedOut || sageContext.timedOut,
    // Add these extra flags to make interface more resilient
    hasApiError: !!sageContext.error,
    useFallback: !!sageContext.error || 
                sageContext.timedOut || 
                contextHydration.hydration.timedOut || 
                (contextHydration.backendContext.userContext?._fallback === true) ||
                (contextHydration.backendContext.orgContext?._fallback === true)
  };
}

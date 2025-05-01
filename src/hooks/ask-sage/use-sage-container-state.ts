
import { useEffect } from 'react';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { useContextHydration } from '@/hooks/sage-context';
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
    showLoading
  } = useAskSageGuard();
  
  // Use the enhanced context hydration system with our new context
  const contextHydration = useContextHydration(
    voiceParamState.currentVoice,
    sageContext.userContext,
    sageContext.orgContext
  );
  
  const { userId, orgId } = useAuth();

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
    canSendMessages: contextHydration.isReadyToSend
  };
}

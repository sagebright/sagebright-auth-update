
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageContextReadiness } from '@/hooks/sage-context';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useContextHydration } from '@/hooks/sage-context/hydration';

export function useAskSageGuard() {
  const { 
    userId, 
    orgId, 
    orgSlug, 
    user, 
    isAuthenticated, 
    loading: authLoading 
  } = useAuth();

  const voiceParamState = useVoiceParamState();
  const [isProtected] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  
  // Get readiness status from the unified context readiness hook
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    user,
    authLoading,
    isAuthenticated,
    voiceParamState.currentVoice
  );
  
  // Get hydration state from the context hydration hook
  const contextHydration = useContextHydration({
    userId,
    orgId,
    orgSlug
  });
  
  // Determine if user can interact with the app
  const canInteract = !authLoading && isAuthenticated;
  
  // Determine if content should render
  const shouldRender = contextReadiness.isReadyToRender || contextReadiness.hasTimedOut;
  
  // Determine if redirects should be allowed (only block if actively loading context)
  const isRedirectAllowed = !authLoading || !isAuthenticated;
  
  // Update loading state based on hydration progress
  useEffect(() => {
    if (contextHydration.hydration.completedSteps === contextHydration.hydration.totalSteps) {
      const timer = setTimeout(() => setShowLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [contextHydration.hydration.completedSteps, contextHydration.hydration.totalSteps]);

  return {
    canInteract,
    shouldRender,
    isRedirectAllowed,
    readinessBlockers: contextReadiness.blockers,
    isProtected,
    showLoading,
    contextHydration
  };
}

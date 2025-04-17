import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageSessionStability } from './use-session-stability';
import { useAskSageRouteProtection } from './use-route-protection';
import { useSageContextReadiness } from '@/hooks/sage-context';
import { useVoiceParamState } from '@/hooks/use-voice-param';

export function useAskSageGuard() {
  const { userId, orgId, user, loading: authLoading } = useAuth();
  const { sessionStable, stabilityTimeMs, readinessBlockers } = useSageSessionStability();
  const { protectionActive, protectionStartTime } = useAskSageRouteProtection();
  const voiceParamState = useVoiceParamState();
  
  // Track protection status
  const [isProtected, setIsProtected] = useState(true);
  const [isProtectedButReady, setIsProtectedButReady] = useState(false);
  const protectionTimeoutRef = useRef<number | null>(null);
  
  // Track readiness for interaction
  const [canInteract, setCanInteract] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Calculate protection time
  const protectionTimeMs = protectionStartTime 
    ? Date.now() - protectionStartTime 
    : null;
  
  // Context readiness check
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    user?.user_metadata?.org_slug ?? null,
    user,
    authLoading,
    !!user,
    voiceParamState.currentVoice
  );
  
  // Release protection after timeout
  useEffect(() => {
    if (isProtected && !protectionTimeoutRef.current) {
      protectionTimeoutRef.current = window.setTimeout(() => {
        console.log('🛡️ Ask Sage protection window expired after timeout');
        setIsProtected(false);
        
        // After timeout, if we're still loading but have enough context,
        // we should allow limited interaction
        if (!contextReadiness.isReadyToRender) {
          console.log('⚠️ Context not fully ready after timeout, enabling limited interaction');
          setIsProtectedButReady(true);
        }
      }, 8000); // 8-second protection window
    }
    
    return () => {
      if (protectionTimeoutRef.current) {
        window.clearTimeout(protectionTimeoutRef.current);
        protectionTimeoutRef.current = null;
      }
    };
  }, [isProtected, contextReadiness.isReadyToRender]);
  
  // Once context is ready, remove protection
  useEffect(() => {
    if (contextReadiness.isReadyToRender && isProtected) {
      console.log('✅ Context ready, removing protection');
      setIsProtected(false);
    }
  }, [contextReadiness.isReadyToRender, isProtected]);
  
  // Track can-interact state
  useEffect(() => {
    const newCanInteract = isProtectedButReady || !isProtected;
    
    // If in development mode and protection has been active for more than 5 seconds,
    // forcibly enable interaction even if context isn't ready
    if (process.env.NODE_ENV === 'development' && 
        protectionTimeMs && 
        protectionTimeMs > 5000 && 
        !newCanInteract) {
      console.log('🧪 Development mode: Forcing interaction after extended protection window');
      setCanInteract(true);
      return;
    }
    
    setCanInteract(newCanInteract);
  }, [isProtected, isProtectedButReady, protectionTimeMs]);
  
  // Track should-render state
  useEffect(() => {
    // In development, we're more permissive about rendering
    if (process.env.NODE_ENV === 'development') {
      if (!userId && authLoading) {
        // Still loading auth, don't render yet
        setShouldRender(false);
      } else if (protectionTimeMs && protectionTimeMs > 5000) {
        // If protection has been active for too long in dev mode, force render
        console.log('🧪 Development mode: Forcing render after extended protection window');
        setShouldRender(true);
      } else {
        // Otherwise, follow normal rules but be more permissive
        setShouldRender(isProtectedButReady || !isProtected || contextReadiness.isReadyToRender);
      }
      return;
    }
    
    // Production logic
    setShouldRender(isProtectedButReady || !isProtected || contextReadiness.isReadyToRender);
  }, [
    isProtected, 
    isProtectedButReady, 
    contextReadiness.isReadyToRender, 
    userId, 
    authLoading,
    protectionTimeMs
  ]);
  
  // Combine all readiness blockers
  const combinedBlockers = [
    ...readinessBlockers,
    ...contextReadiness.blockers
  ].filter((blocker, index, self) => self.indexOf(blocker) === index);
  
  return {
    canInteract,
    shouldRender,
    isProtected,
    isProtectedButReady,
    isRedirectAllowed: !protectionActive,
    readinessBlockers: combinedBlockers,
    protectionTimeMs,
    stabilityTimeMs,
    showLoading: !canInteract || !shouldRender
  };
}

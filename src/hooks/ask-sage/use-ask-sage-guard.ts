import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageSessionStability } from './use-session-stability';
import { useAskSageRouteProtection } from './use-route-protection';
import { useSageContextReadiness } from '@/hooks/sage-context';
import { useVoiceParamState } from '@/hooks/use-voice-param';

export function useAskSageGuard() {
  console.log("🛡️ useAskSageGuard initialized");
  
  const { userId, orgId, user, loading: authLoading } = useAuth();
  console.log("🔐 Auth state in useAskSageGuard:", { userId, orgId, hasUser: !!user, authLoading });
  
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
  
  console.log("🚀 Preparing to evaluate context readiness with:", {
    userId,
    orgId,
    orgSlug: user?.user_metadata?.org_slug ?? null,
    voiceParam: voiceParamState.currentVoice
  });
  
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
      console.log('⏱️ Setting up Ask Sage protection window timeout (8s)');
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
    console.log('🤝 Can interact state updated:', { 
      canInteract: newCanInteract, 
      isProtected, 
      isProtectedButReady
    });
  }, [isProtected, isProtectedButReady, protectionTimeMs]);
  
  // Track should-render state
  useEffect(() => {
    // In development, we're more permissive about rendering
    if (process.env.NODE_ENV === 'development') {
      if (!userId && authLoading) {
        // Still loading auth, don't render yet
        console.log('⏳ Auth still loading in dev mode, delaying render');
        setShouldRender(false);
      } else if (protectionTimeMs && protectionTimeMs > 5000) {
        // If protection has been active for too long in dev mode, force render
        console.log('🧪 Development mode: Forcing render after extended protection window');
        setShouldRender(true);
      } else {
        // Otherwise, follow normal rules but be more permissive
        const shouldRenderValue = isProtectedButReady || !isProtected || contextReadiness.isReadyToRender;
        console.log('🖼️ Updating shouldRender in dev mode:', { shouldRenderValue });
        setShouldRender(shouldRenderValue);
      }
      return;
    }
    
    // Production logic
    const shouldRenderValue = isProtectedButReady || !isProtected || contextReadiness.isReadyToRender;
    console.log('🖼️ Updating shouldRender in production:', { shouldRenderValue });
    setShouldRender(shouldRenderValue);
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
  
  console.log("🛡️ useAskSageGuard returning final state:", { 
    canInteract, 
    shouldRender, 
    isProtected,
    blockerCount: combinedBlockers.length
  });
  
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

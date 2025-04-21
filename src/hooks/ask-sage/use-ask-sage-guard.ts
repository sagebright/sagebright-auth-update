
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageSessionStability } from './use-session-stability';
import { useAskSageRouteProtection } from './use-route-protection';
import { useSageContextReadiness } from '@/hooks/sage-context';
import { useVoiceParamState } from '@/hooks/use-voice-param';

export function useAskSageGuard() {
  const renderCountRef = useRef(0);
  
  // Log initialization only once
  useEffect(() => {
    renderCountRef.current++;
    
    if (renderCountRef.current === 1) {
      console.log("🛡️ useAskSageGuard initialized");
    }
  }, []);
  
  const { userId, orgId, user, loading: authLoading } = useAuth();
  
  // Only log auth state changes, not on every render
  const prevAuthStateRef = useRef({ userId, orgId, hasUser: !!user, authLoading });
  
  useEffect(() => {
    const current = { userId, orgId, hasUser: !!user, authLoading };
    const prev = prevAuthStateRef.current;
    
    if (
      prev.userId !== current.userId ||
      prev.orgId !== current.orgId ||
      prev.hasUser !== current.hasUser ||
      prev.authLoading !== current.authLoading
    ) {
      console.log("🔐 Auth state in useAskSageGuard changed:", current);
      prevAuthStateRef.current = current;
    }
  }, [userId, orgId, user, authLoading]);
  
  const { sessionStable, stabilityTimeMs, readinessBlockers } = useSageSessionStability();
  const { protectionActive, protectionStartTime } = useAskSageRouteProtection();
  const voiceParamState = useVoiceParamState();
  
  // Track protection status with refs to reduce state updates
  const [isProtected, setIsProtected] = useState(true);
  const [isProtectedButReady, setIsProtectedButReady] = useState(false);
  const protectionTimeoutRef = useRef<number | null>(null);
  const hasSetProtectionTimeoutRef = useRef(false);
  
  // Track readiness for interaction
  const [canInteract, setCanInteract] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Calculate protection time once
  const protectionTimeMs = useMemo(() => {
    return protectionStartTime ? Date.now() - protectionStartTime : null;
  }, [protectionStartTime]);
  
  // Stable voice param to prevent unnecessary context readiness evaluations
  const stableVoiceParam = useRef(voiceParamState.currentVoice).current;
  
  // Log context readiness preparation only on mount
  useEffect(() => {
    console.log("🚀 Preparing to evaluate context readiness with:", {
      userId,
      orgId,
      orgSlug: user?.user_metadata?.org_slug ?? null,
      voiceParam: stableVoiceParam
    });
  }, []);
  
  // Context readiness check - use stable values
  const userMetadata = user?.user_metadata;
  const orgSlug = userMetadata?.org_slug ?? null;
  
  const contextReadiness = useSageContextReadiness(
    userId,
    orgId,
    orgSlug,
    user,
    authLoading,
    !!user,
    stableVoiceParam
  );
  
  // Release protection after timeout - do this only once
  useEffect(() => {
    if (isProtected && !protectionTimeoutRef.current && !hasSetProtectionTimeoutRef.current) {
      console.log('⏱️ Setting up Ask Sage protection window timeout (8s)');
      hasSetProtectionTimeoutRef.current = true;
      
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
  
  // Once context is ready, remove protection - but only change state when needed
  useEffect(() => {
    if (contextReadiness.isReadyToRender && isProtected) {
      console.log('✅ Context ready, removing protection');
      setIsProtected(false);
    }
  }, [contextReadiness.isReadyToRender, isProtected]);
  
  // Track can-interact state - memoize calculation to prevent unnecessary state updates
  useEffect(() => {
    const newCanInteract = isProtectedButReady || !isProtected;
    
    // If in development mode and protection has been active for more than 5 seconds,
    // forcibly enable interaction even if context isn't ready
    if (process.env.NODE_ENV === 'development' && 
        protectionTimeMs && 
        protectionTimeMs > 5000 && 
        !newCanInteract) {
      
      if (canInteract !== true) {
        console.log('🧪 Development mode: Forcing interaction after extended protection window');
        setCanInteract(true);
      }
      return;
    }
    
    if (canInteract !== newCanInteract) {
      setCanInteract(newCanInteract);
      console.log('🤝 Can interact state updated:', { 
        canInteract: newCanInteract, 
        isProtected, 
        isProtectedButReady
      });
    }
  }, [isProtected, isProtectedButReady, protectionTimeMs, canInteract]);
  
  // Track should-render state - memoize calculation to prevent unnecessary state updates
  useEffect(() => {
    // In development, we're more permissive about rendering
    if (process.env.NODE_ENV === 'development') {
      if (!userId && authLoading) {
        // Still loading auth, don't render yet
        if (shouldRender !== false) {
          console.log('⏳ Auth still loading in dev mode, delaying render');
          setShouldRender(false);
        }
      } else if (protectionTimeMs && protectionTimeMs > 5000) {
        // If protection has been active for too long in dev mode, force render
        if (shouldRender !== true) {
          console.log('🧪 Development mode: Forcing render after extended protection window');
          setShouldRender(true);
        }
      } else {
        // Otherwise, follow normal rules but be more permissive
        const shouldRenderValue = isProtectedButReady || !isProtected || contextReadiness.isReadyToRender;
        if (shouldRender !== shouldRenderValue) {
          console.log('🖼️ Updating shouldRender in dev mode:', { shouldRenderValue });
          setShouldRender(shouldRenderValue);
        }
      }
      return;
    }
    
    // Production logic
    const shouldRenderValue = isProtectedButReady || !isProtected || contextReadiness.isReadyToRender;
    if (shouldRender !== shouldRenderValue) {
      console.log('🖼️ Updating shouldRender in production:', { shouldRenderValue });
      setShouldRender(shouldRenderValue);
    }
  }, [
    isProtected, 
    isProtectedButReady, 
    contextReadiness.isReadyToRender, 
    userId, 
    authLoading,
    protectionTimeMs,
    shouldRender
  ]);
  
  // Combine all readiness blockers - memoize to prevent unnecessary calculations
  const combinedBlockers = useMemo(() => {
    return [
      ...readinessBlockers,
      ...contextReadiness.blockers
    ].filter((blocker, index, self) => self.indexOf(blocker) === index);
  }, [readinessBlockers, contextReadiness.blockers]);
  
  // Only log final state when it changes
  const prevStateRef = useRef({
    canInteract, 
    shouldRender, 
    isProtected,
    blockerCount: combinedBlockers.length
  });
  
  useEffect(() => {
    const current = { 
      canInteract, 
      shouldRender, 
      isProtected,
      blockerCount: combinedBlockers.length
    };
    const prev = prevStateRef.current;
    
    if (
      prev.canInteract !== current.canInteract ||
      prev.shouldRender !== current.shouldRender ||
      prev.isProtected !== current.isProtected ||
      prev.blockerCount !== current.blockerCount
    ) {
      console.log("🛡️ useAskSageGuard returning updated state:", current);
      prevStateRef.current = current;
    }
  }, [canInteract, shouldRender, isProtected, combinedBlockers.length]);
  
  // Memoize the result to maintain a stable reference
  return useMemo(() => ({
    canInteract,
    shouldRender,
    isProtected,
    isProtectedButReady,
    isRedirectAllowed: !protectionActive,
    readinessBlockers: combinedBlockers,
    protectionTimeMs,
    stabilityTimeMs,
    showLoading: !canInteract || !shouldRender
  }), [
    canInteract, 
    shouldRender, 
    isProtected, 
    isProtectedButReady, 
    protectionActive, 
    combinedBlockers, 
    protectionTimeMs, 
    stabilityTimeMs
  ]);
}


import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSageSessionStability } from './use-session-stability';
import { useAskSageRouteProtection } from './use-route-protection';
import { useContextHydration } from '@/hooks/sage-context/hydration';
import { useVoiceParamState } from '@/hooks/use-voice-param';
import { useSageContext } from '@/hooks/sage-context';

export function useAskSageGuard() {
  console.log("🛡️ useAskSageGuard initialized");
  
  const { userId, orgId, user, loading: authLoading } = useAuth();
  console.log("🔐 Auth state in useAskSageGuard:", { userId, orgId, hasUser: !!user, authLoading });
  
  const { sessionStable, stabilityTimeMs, readinessBlockers: sessionBlockers } = useSageSessionStability();
  const { protectionActive, protectionStartTime } = useAskSageRouteProtection();
  const voiceParamState = useVoiceParamState();
  
  // Get the Sage context
  const sageContext = useSageContext();
  
  // Use the canonical hydration tracking hook
  const contextHydration = useContextHydration(
    voiceParamState.currentVoice,
    sageContext.userContext,
    sageContext.orgContext
  );
  
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
  
  // Check for debug flag in URL
  const isDebugModeActive = () => {
    // Check for ?debug=stuck or other debug mode flags
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === 'stuck';
  };
  
  // Release protection after timeout
  useEffect(() => {
    // Check if we're in debug mode
    const debugMode = isDebugModeActive();
    if (debugMode) {
      console.log('🧪 Debug mode active: Disabling protection and gating');
      setIsProtected(false);
      setCanInteract(true);
      setShouldRender(true);
      return; // Skip protection logic in debug mode
    }
    
    if (isProtected && !protectionTimeoutRef.current) {
      console.log('⏱️ Setting up Ask Sage protection window timeout (8s)');
      protectionTimeoutRef.current = window.setTimeout(() => {
        console.log('🛡️ Ask Sage protection window expired after timeout');
        setIsProtected(false);
        
        // After timeout, if we're still loading but have enough context,
        // we should allow limited interaction
        if (!contextHydration.isReadyToRender) {
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
  }, [isProtected, contextHydration.isReadyToRender]);
  
  // Once context is ready, remove protection
  useEffect(() => {
    // Skip in debug mode
    if (isDebugModeActive()) return;
    
    if (contextHydration.isReadyToRender && isProtected) {
      console.log('✅ Context ready, removing protection');
      setIsProtected(false);
    }
  }, [contextHydration.isReadyToRender, isProtected]);
  
  // Track can-interact state
  useEffect(() => {
    // Skip in debug mode - already set
    if (isDebugModeActive()) return;
    
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
    // Skip in debug mode - already set
    if (isDebugModeActive()) return;
    
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
        const shouldRenderValue = isProtectedButReady || !isProtected || contextHydration.isReadyToRender;
        console.log('🖼️ Updating shouldRender in dev mode:', { shouldRenderValue });
        setShouldRender(shouldRenderValue);
      }
      return;
    }
    
    // Production logic
    const shouldRenderValue = isProtectedButReady || !isProtected || contextHydration.isReadyToRender;
    console.log('🖼️ Updating shouldRender in production:', { shouldRenderValue });
    setShouldRender(shouldRenderValue);
  }, [
    isProtected, 
    isProtectedButReady, 
    contextHydration.isReadyToRender, 
    userId, 
    authLoading,
    protectionTimeMs
  ]);
  
  // Combine all readiness blockers
  const combinedBlockers = [
    ...sessionBlockers,
    ...contextHydration.blockers
  ].filter((blocker, index, self) => self.indexOf(blocker) === index);
  
  console.log("🛡️ useAskSageGuard returning final state:", { 
    canInteract, 
    shouldRender, 
    isProtected,
    blockerCount: combinedBlockers.length,
    hydrationProgress: contextHydration.hydration.progressPercent,
    debugMode: isDebugModeActive()
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
    showLoading: !canInteract || !shouldRender,
    contextHydration,  // Expose the full hydration context for components
    isDebugMode: isDebugModeActive() // Expose debug mode status
  };
}

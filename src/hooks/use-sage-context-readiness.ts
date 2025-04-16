
import { useEffect, useState, useRef } from 'react';

export interface SageContextReadiness {
  // Core readiness flags
  isOrgReady: boolean;
  isSessionReady: boolean;
  isVoiceReady: boolean;
  isReadyToRender: boolean;
  
  // Backward compatibility properties for existing code
  isContextReady: boolean;
  contextCheckComplete: boolean;
  missingContext: boolean;
  
  // Timestamp when fully ready (null if not ready)
  readySince: number | null;
  
  // Human-readable blockers
  blockers: string[];
}

/**
 * Enhanced hook that provides granular context readiness states for Sage
 * Serves as the single source of truth for determining when Sage is ready to render
 */
export function useSageContextReadiness(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  authLoading: boolean,
  isSessionUserReady: boolean,
  voiceParam: string | null = null // Making this optional with a default value
): SageContextReadiness {
  // Initialize state with not-ready values
  const [readiness, setReadiness] = useState<SageContextReadiness>({
    isOrgReady: false,
    isSessionReady: false,
    isVoiceReady: false,
    isReadyToRender: false,
    isContextReady: false,
    contextCheckComplete: false,
    missingContext: true,
    readySince: null,
    blockers: ['Initializing context']
  });
  
  // Track previous state for transition logging
  const prevReadinessRef = useRef<SageContextReadiness | null>(null);
  
  useEffect(() => {
    // Don't evaluate until auth loading is complete
    if (authLoading) {
      return;
    }
    
    // Start with empty blockers array, we'll add to it as needed
    const blockers: string[] = [];
    
    // Check each context requirement and add specific blockers
    if (!userId) blockers.push('User ID missing');
    if (!orgId) blockers.push('Organization ID missing');
    if (!orgSlug) blockers.push('Organization slug missing');
    if (!currentUserData) blockers.push('User data not loaded');
    if (!isSessionUserReady) blockers.push('Session user not ready');
    if (!voiceParam) blockers.push('Voice parameter not initialized');
    
    // Determine individual readiness flags
    const isSessionReady = !!userId && isSessionUserReady;
    const isOrgReady = !!orgId && !!orgSlug;
    const isVoiceReady = !!voiceParam;
    
    // Overall readiness requires all individual flags
    const isReadyToRender = isSessionReady && isOrgReady && isVoiceReady && !!currentUserData;
    
    // For backward compatibility
    const isContextReady = isReadyToRender;
    const contextCheckComplete = true;
    const missingContext = !isReadyToRender;
    
    // Calculate readySince timestamp only when ready
    const readySince = isReadyToRender 
      ? (readiness.readySince ?? Date.now()) 
      : null;
    
    // Prepare new state
    const newReadiness: SageContextReadiness = {
      isOrgReady,
      isSessionReady,
      isVoiceReady,
      isReadyToRender,
      isContextReady,
      contextCheckComplete,
      missingContext,
      readySince,
      blockers
    };
    
    // Log transitions in readiness state
    if (prevReadinessRef.current?.isReadyToRender !== isReadyToRender) {
      if (isReadyToRender) {
        console.log(`🔁 Context Transition: NOT READY → READY at ${new Date().toISOString()}`);
      } else {
        console.log(`🔁 Context Transition: READY → NOT READY at ${new Date().toISOString()}`);
        console.log(`🛑 Context Blocked: ${blockers.join(', ')}`);
      }
    } else if (blockers.length !== prevReadinessRef.current?.blockers.length) {
      // Log when blockers change, even if overall ready state remains the same
      console.log(`🔁 Context Blockers Changed: ${blockers.join(', ')}`);
    }
    
    // Detailed debug log
    console.log("[SageContext] Context readiness check:", {
      isSessionReady,
      isOrgReady,
      isVoiceReady,
      isReadyToRender,
      blockers,
      timestamp: new Date().toISOString()
    });
    
    // Update refs and state
    prevReadinessRef.current = newReadiness;
    setReadiness(newReadiness);
    
  }, [userId, orgId, orgSlug, currentUserData, authLoading, isSessionUserReady, voiceParam, readiness.readySince]);
  
  return readiness;
}

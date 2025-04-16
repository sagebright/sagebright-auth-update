
import { useEffect, useState, useRef, useMemo } from 'react';

export interface SageContextReadiness {
  // Core readiness flags
  isOrgReady: boolean;
  isSessionReady: boolean;
  isVoiceReady: boolean;
  isReadyToRender: boolean;
  
  // Session stability flag - true only when all auth components are stable
  isSessionStable: boolean;
  
  // Backward compatibility properties
  isContextReady: boolean;
  contextCheckComplete: boolean;
  missingContext: boolean;
  
  // Timestamp when fully ready (null if not ready)
  readySince: number | null;
  
  // Human-readable blockers
  blockers: string[];
}

// Type for individual readiness check results
interface ReadinessCheck {
  isReady: boolean;
  blockers: string[];
}

/**
 * Enhanced hook that provides granular context readiness states for Sage
 * with decoupled checks, better error handling, and improved logging
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
    isSessionStable: false,
    isContextReady: false,
    contextCheckComplete: false,
    missingContext: true,
    readySince: null,
    blockers: ['Initializing context']
  });
  
  // Track previous state for transition logging
  const prevReadinessRef = useRef<SageContextReadiness | null>(null);
  
  // Decoupled session readiness check
  const checkSessionReadiness = useMemo((): ReadinessCheck => {
    const blockers: string[] = [];
    
    if (!userId) blockers.push('User ID missing');
    if (!isSessionUserReady) blockers.push('Session user not ready');
    if (!currentUserData) blockers.push('User data not loaded');
    
    return {
      isReady: !!userId && isSessionUserReady && !!currentUserData,
      blockers
    };
  }, [userId, isSessionUserReady, currentUserData]);
  
  // Decoupled organization readiness check
  const checkOrgReadiness = useMemo((): ReadinessCheck => {
    const blockers: string[] = [];
    
    if (!orgId) blockers.push('Organization ID missing');
    if (!orgSlug) blockers.push('Organization slug missing');
    
    return {
      isReady: !!orgId && !!orgSlug,
      blockers
    };
  }, [orgId, orgSlug]);
  
  // Decoupled voice parameter readiness check
  const checkVoiceReadiness = useMemo((): ReadinessCheck => {
    const blockers: string[] = [];
    
    if (!voiceParam) blockers.push('Voice parameter not initialized');
    
    return {
      isReady: !!voiceParam,
      blockers
    };
  }, [voiceParam]);
  
  // Session stability check - requires auth components to be stable
  const checkSessionStability = useMemo((): ReadinessCheck => {
    const blockers: string[] = [];
    
    // Check if signed in with Supabase
    if (!isSessionUserReady) blockers.push('Supabase session not signed in');
    
    // Check if org context is available
    if (!orgId || !orgSlug) blockers.push('Organization context incomplete');
    
    // Check if user metadata is available
    if (!currentUserData?.user_metadata) blockers.push('User metadata missing');
    
    const isStable = isSessionUserReady && !!orgId && !!orgSlug && !!currentUserData?.user_metadata;
    
    return {
      isReady: isStable,
      blockers
    };
  }, [isSessionUserReady, orgId, orgSlug, currentUserData]);
  
  useEffect(() => {
    // Don't evaluate until auth loading is complete
    if (authLoading) {
      return;
    }
    
    try {
      // Start a console group for readiness evaluation
      console.group('🔍 Context Readiness Evaluation');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Auth state:', { userId, orgId, isSessionUserReady });
      
      // Get results from individual checks
      const sessionCheck = checkSessionReadiness;
      const orgCheck = checkOrgReadiness;
      const voiceCheck = checkVoiceReadiness;
      const stabilityCheck = checkSessionStability;
      
      // Log individual check results
      console.log('Session readiness:', sessionCheck);
      console.log('Organization readiness:', orgCheck);
      console.log('Voice readiness:', voiceCheck);
      console.log('Session stability:', stabilityCheck);
      
      // Combine all blockers
      const allBlockers = [
        ...sessionCheck.blockers,
        ...orgCheck.blockers,
        ...voiceCheck.blockers
      ];
      
      // Overall readiness requires all individual checks
      const isReadyToRender = 
        sessionCheck.isReady && 
        orgCheck.isReady && 
        voiceCheck.isReady;
      
      // For backward compatibility
      const isContextReady = isReadyToRender;
      const contextCheckComplete = true;
      const missingContext = !isReadyToRender;
      
      // Calculate readySince timestamp only when ready
      const readySince = isReadyToRender 
        ? (readiness.readySince ?? Date.now()) 
        : null;
      
      if (allBlockers.length === 0 && !isReadyToRender) {
        console.warn('No blockers identified but context is not ready. This may indicate a logic issue.');
        allBlockers.push('Unknown readiness issue');
      }
      
      // Prepare new state
      const newReadiness: SageContextReadiness = {
        isOrgReady: orgCheck.isReady,
        isSessionReady: sessionCheck.isReady,
        isVoiceReady: voiceCheck.isReady,
        isReadyToRender,
        isSessionStable: stabilityCheck.isReady,
        isContextReady,
        contextCheckComplete,
        missingContext,
        readySince,
        blockers: allBlockers
      };
      
      // Log transitions in readiness state
      if (prevReadinessRef.current?.isReadyToRender !== isReadyToRender) {
        console.group('🔄 Context Readiness Transition');
        if (isReadyToRender) {
          console.log(`NOT READY → READY at ${new Date().toISOString()}`);
          console.log(`Time to ready: ${readySince ? (readySince - performance.now()) + 'ms' : 'unknown'}`);
        } else {
          console.log(`READY → NOT READY at ${new Date().toISOString()}`);
          console.log(`Blockers: ${allBlockers.join(', ')}`);
        }
        console.groupEnd();
      } else if (
        JSON.stringify(prevReadinessRef.current?.blockers) !== 
        JSON.stringify(allBlockers)
      ) {
        // Log when blockers change, even if overall ready state remains the same
        console.log(`🔄 Context Blockers Changed: ${allBlockers.join(', ')}`);
      }
      
      // Log session stability transitions
      if (prevReadinessRef.current?.isSessionStable !== stabilityCheck.isReady) {
        console.group('🔒 Session Stability Transition');
        if (stabilityCheck.isReady) {
          console.log(`UNSTABLE → STABLE at ${new Date().toISOString()}`);
        } else {
          console.log(`STABLE → UNSTABLE at ${new Date().toISOString()}`);
          console.log(`Stability blockers: ${stabilityCheck.blockers.join(', ')}`);
        }
        console.groupEnd();
      }
      
      // Update refs and state
      prevReadinessRef.current = newReadiness;
      setReadiness(newReadiness);
      
    } catch (error) {
      console.error('Error in context readiness evaluation:', error);
      
      // Safe fallback on error
      setReadiness({
        ...readiness,
        contextCheckComplete: true,
        blockers: [...readiness.blockers, `Error in readiness check: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
    } finally {
      console.groupEnd();
    }
    
  }, [
    userId, 
    orgId, 
    orgSlug, 
    currentUserData, 
    authLoading, 
    isSessionUserReady, 
    voiceParam, 
    readiness.readySince,
    checkSessionReadiness,
    checkOrgReadiness,
    checkVoiceReadiness,
    checkSessionStability
  ]);
  
  return readiness;
}

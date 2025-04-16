
import { useEffect, useState, useRef, useMemo } from 'react';
import { SageContextReadiness } from './types';
import { 
  checkSessionReadiness,
  checkOrgReadiness,
  checkVoiceReadiness,
  checkSessionStability
} from './readiness-checks';
import { logReadinessTransition } from './readiness-logger';

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
  const sessionCheck = useMemo(() => 
    checkSessionReadiness(userId, isSessionUserReady, currentUserData),
  [userId, isSessionUserReady, currentUserData]);
  
  // Decoupled organization readiness check
  const orgCheck = useMemo(() => 
    checkOrgReadiness(orgId, orgSlug),
  [orgId, orgSlug]);
  
  // Decoupled voice parameter readiness check
  const voiceCheck = useMemo(() => 
    checkVoiceReadiness(voiceParam),
  [voiceParam]);
  
  // Session stability check - requires auth components to be stable
  const stabilityCheck = useMemo(() => 
    checkSessionStability(isSessionUserReady, orgId, orgSlug, currentUserData),
  [isSessionUserReady, orgId, orgSlug, currentUserData]);
  
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
      
      // Log transitions
      logReadinessTransition(prevReadinessRef.current, newReadiness);
      
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
    sessionCheck,
    orgCheck,
    voiceCheck,
    stabilityCheck
  ]);
  
  return readiness;
}

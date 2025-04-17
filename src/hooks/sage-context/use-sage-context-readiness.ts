
import { useEffect, useState, useRef, useMemo } from 'react';
import { SageContextReadiness } from './types';
import { 
  checkAuthReadiness,
  checkSessionReadiness,
  checkUserMetadataReadiness,
  checkOrgReadiness,
  checkOrgMetadataReadiness,
  checkVoiceReadiness,
  checkBackendContextReadiness,
  checkSessionStability,
  checkReadyToSend,
  categorizeBlockers
} from './readiness-checks';
import { logReadinessTransition, logDependencyStatus } from './readiness-logger';

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
  voiceParam: string | null = null, // Making this optional with a default value
  backend: {
    userContext?: any | null,
    orgContext?: any | null
  } = {}
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
    blockers: ['Initializing context'],
    
    // New granular readiness flags
    isAuthReady: false,
    isUserMetadataReady: false,
    isOrgMetadataReady: false,
    isOrgSlugReady: false,
    isBackendContextReady: false,
    isReadyToSend: false,
    
    // New categorized blockers
    blockersByCategory: {
      auth: ['Initializing authentication']
    }
  });
  
  // Track previous state for transition logging
  const prevReadinessRef = useRef<SageContextReadiness | null>(null);
  
  // Extract backend context values
  const { userContext = null, orgContext = null } = backend;
  
  // Run individual checks for each dependency
  const authCheck = useMemo(() => 
    checkAuthReadiness(userId, isSessionUserReady),
  [userId, isSessionUserReady]);
  
  const sessionCheck = useMemo(() => 
    checkSessionReadiness(userId, isSessionUserReady, currentUserData),
  [userId, isSessionUserReady, currentUserData]);
  
  const userMetadataCheck = useMemo(() => 
    checkUserMetadataReadiness(currentUserData),
  [currentUserData]);
  
  const orgCheck = useMemo(() => 
    checkOrgReadiness(orgId, orgSlug),
  [orgId, orgSlug]);
  
  const orgMetadataCheck = useMemo(() => 
    checkOrgMetadataReadiness(orgContext),
  [orgContext]);
  
  const voiceCheck = useMemo(() => 
    checkVoiceReadiness(voiceParam),
  [voiceParam]);
  
  const backendContextCheck = useMemo(() => 
    checkBackendContextReadiness(userContext, orgContext),
  [userContext, orgContext]);
  
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
      console.log('Auth readiness:', authCheck);
      console.log('Session readiness:', sessionCheck);
      console.log('User metadata readiness:', userMetadataCheck);
      console.log('Organization readiness:', orgCheck);
      console.log('Organization metadata readiness:', orgMetadataCheck);
      console.log('Voice readiness:', voiceCheck);
      console.log('Backend context readiness:', backendContextCheck);
      console.log('Session stability:', stabilityCheck);
      
      // Group blockers by category
      const blockersByCategory = categorizeBlockers(
        authCheck.blockers,
        [...sessionCheck.blockers, ...userMetadataCheck.blockers], 
        [...orgCheck.blockers, ...orgMetadataCheck.blockers],
        voiceCheck.blockers,
        backendContextCheck.blockers
      );
      
      // Combine all blockers for backward compatibility
      const allBlockers = [
        ...authCheck.blockers,
        ...sessionCheck.blockers,
        ...userMetadataCheck.blockers,
        ...orgCheck.blockers,
        ...orgMetadataCheck.blockers,
        ...voiceCheck.blockers,
        ...backendContextCheck.blockers
      ];
      
      // Determine overall readiness state
      const isAuthReady = authCheck.isReady;
      const isSessionReady = sessionCheck.isReady;
      const isUserMetadataReady = userMetadataCheck.isReady;
      const isOrgReady = orgCheck.isReady;
      const isOrgMetadataReady = orgMetadataCheck.isReady;
      const isOrgSlugReady = !!orgSlug;
      const isVoiceReady = voiceCheck.isReady;
      const isBackendContextReady = backendContextCheck.isReady;
      
      // Ready to render: core dependencies required for UI
      const isReadyToRender = 
        isAuthReady && 
        isSessionReady && 
        isOrgReady && 
        isVoiceReady;
      
      // Ready to send: more stringent, requires all context
      const readyToSendCheck = checkReadyToSend(
        isAuthReady,
        isSessionReady,
        isOrgReady,
        isVoiceReady,
        isBackendContextReady
      );
      
      const isReadyToSend = readyToSendCheck.isReady;
      
      // Log dependency status
      logDependencyStatus('Context', {
        auth: isAuthReady,
        session: isSessionReady,
        userMetadata: isUserMetadataReady,
        org: isOrgReady,
        orgMetadata: isOrgMetadataReady,
        orgSlug: isOrgSlugReady,
        voice: isVoiceReady,
        backend: isBackendContextReady,
        readyToRender: isReadyToRender,
        readyToSend: isReadyToSend
      }, blockersByCategory);
      
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
        isOrgReady,
        isSessionReady,
        isVoiceReady,
        isReadyToRender,
        isSessionStable: stabilityCheck.isReady,
        isContextReady,
        contextCheckComplete,
        missingContext,
        readySince,
        blockers: allBlockers,
        
        // New granular readiness flags
        isAuthReady,
        isUserMetadataReady,
        isOrgMetadataReady,
        isOrgSlugReady,
        isBackendContextReady,
        isReadyToSend,
        
        // New categorized blockers
        blockersByCategory
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
        blockers: [...readiness.blockers, `Error in readiness check: ${error instanceof Error ? error.message : 'Unknown error'}`],
        blockersByCategory: {
          ...readiness.blockersByCategory,
          system: [`Error in readiness check: ${error instanceof Error ? error.message : 'Unknown error'}`]
        }
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
    userContext,
    orgContext,
    authCheck,
    sessionCheck,
    userMetadataCheck,
    orgCheck,
    orgMetadataCheck,
    voiceCheck,
    backendContextCheck,
    stabilityCheck
  ]);
  
  return readiness;
}


import { SageContextReadiness } from '../types';
import { checkReadyToSend, categorizeBlockers } from '../readiness-checks';
import { logDependencyStatus } from '../readiness-logger';
import { ReadinessCheck } from '../readiness-checks/readiness-utils';

/**
 * Calculate the final readiness state based on all checks
 */
export function calculateReadinessState(
  authCheck: ReadinessCheck,
  sessionCheck: ReadinessCheck,
  userMetadataCheck: ReadinessCheck,
  orgCheck: ReadinessCheck,
  orgMetadataCheck: ReadinessCheck,
  voiceCheck: ReadinessCheck,
  backendContextCheck: ReadinessCheck,
  stabilityCheck: ReadinessCheck,
  currentReadiness: SageContextReadiness,
  orgSlug: string | null
): SageContextReadiness {
  try {
    // Log individual check results
    console.group('🔍 Context Readiness Evaluation');
    console.log('Timestamp:', new Date().toISOString());
    
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
      ? (currentReadiness.readySince ?? Date.now()) 
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
    
    return newReadiness;
  } catch (error) {
    console.error('Error in context readiness evaluation:', error);
    
    // Safe fallback on error
    return {
      ...currentReadiness,
      contextCheckComplete: true,
      blockers: [...currentReadiness.blockers, `Error in readiness check: ${error instanceof Error ? error.message : 'Unknown error'}`],
      blockersByCategory: {
        ...currentReadiness.blockersByCategory,
        system: [`Error in readiness check: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    };
  } finally {
    console.groupEnd();
  }
}


import { useMemo } from 'react';
import { SageContextReadiness } from '../types';
import { useReadinessChecks } from './use-readiness-checks';
import { calculateReadinessState } from './readiness-calculator';
import { ReadinessEvaluatorResult } from './types';

/**
 * Hook to evaluate all readiness checks and prepare a consolidated status
 */
export function useReadinessEvaluator(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  isSessionUserReady: boolean,
  voiceParam: string | null,
  userContext: any | null,
  orgContext: any | null,
  currentReadiness: SageContextReadiness
): ReadinessEvaluatorResult {
  // Use our custom hook to get individual check results
  const {
    authCheck,
    sessionCheck,
    userMetadataCheck,
    orgCheck,
    orgMetadataCheck,
    voiceCheck,
    backendContextCheck,
    stabilityCheck
  } = useReadinessChecks(
    userId,
    orgId,
    orgSlug,
    currentUserData,
    isSessionUserReady,
    voiceParam,
    userContext,
    orgContext
  );
  
  // Function to evaluate all checks and build the final readiness state
  const evaluateReadiness = useMemo(() => {
    return () => {
      // Log auth state
      console.log('Auth state:', { userId, orgId, isSessionUserReady });
      
      return calculateReadinessState(
        authCheck,
        sessionCheck,
        userMetadataCheck,
        orgCheck,
        orgMetadataCheck,
        voiceCheck,
        backendContextCheck,
        stabilityCheck,
        currentReadiness,
        orgSlug
      );
    };
  }, [
    authCheck,
    sessionCheck,
    userMetadataCheck,
    orgCheck,
    orgMetadataCheck,
    voiceCheck,
    backendContextCheck,
    stabilityCheck,
    currentReadiness,
    userId,
    orgId,
    orgSlug,
    isSessionUserReady
  ]);
  
  return {
    authCheck,
    sessionCheck,
    userMetadataCheck,
    orgCheck,
    orgMetadataCheck,
    voiceCheck,
    backendContextCheck,
    stabilityCheck,
    evaluateReadiness
  };
}

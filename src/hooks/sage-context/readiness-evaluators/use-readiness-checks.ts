
import { useMemo } from 'react';
import {
  checkAuthReadiness,
  checkSessionReadiness,
  checkUserMetadataReadiness,
  checkOrgReadiness,
  checkOrgMetadataReadiness,
  checkVoiceReadiness,
  checkBackendContextReadiness,
  checkSessionStability
} from '../readiness-checks';

/**
 * Hook to evaluate individual readiness checks
 */
export function useReadinessChecks(
  userId: string | null,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null,
  isSessionUserReady: boolean,
  voiceParam: string | null,
  userContext: any | null,
  orgContext: any | null
) {
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

  return {
    authCheck,
    sessionCheck,
    userMetadataCheck,
    orgCheck,
    orgMetadataCheck,
    voiceCheck,
    backendContextCheck,
    stabilityCheck
  };
}


import { ReadinessCheck } from './types';

/**
 * Check if user session is properly initialized and ready
 */
export function checkSessionReadiness(
  userId: string | null,
  isSessionUserReady: boolean,
  currentUserData: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!userId) blockers.push('User ID missing');
  if (!isSessionUserReady) blockers.push('Session user not ready');
  if (!currentUserData) blockers.push('User data not loaded');
  
  return {
    isReady: !!userId && isSessionUserReady && !!currentUserData,
    blockers
  };
}

/**
 * Check if organization context is properly initialized and ready
 */
export function checkOrgReadiness(
  orgId: string | null,
  orgSlug: string | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!orgId) blockers.push('Organization ID missing');
  if (!orgSlug) blockers.push('Organization slug missing');
  
  return {
    isReady: !!orgId && !!orgSlug,
    blockers
  };
}

/**
 * Check if voice parameter is properly initialized
 */
export function checkVoiceReadiness(
  voiceParam: string | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!voiceParam) blockers.push('Voice parameter not initialized');
  
  return {
    isReady: !!voiceParam,
    blockers
  };
}

/**
 * Check if session is stable (all critical auth components are available)
 */
export function checkSessionStability(
  isSessionUserReady: boolean,
  orgId: string | null, 
  orgSlug: string | null,
  currentUserData: any | null
): ReadinessCheck {
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
}

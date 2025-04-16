
import { ReadinessCheck, DependencyPriority, DependencyStatus } from './types';

/**
 * Check if user authentication is properly initialized
 */
export function checkAuthReadiness(
  userId: string | null,
  isAuthenticated: boolean
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!isAuthenticated) blockers.push('User not authenticated');
  if (!userId) blockers.push('User ID missing');
  
  return {
    isReady: isAuthenticated && !!userId,
    blockers
  };
}

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
 * Check if user metadata is properly loaded
 */
export function checkUserMetadataReadiness(
  user: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!user) {
    blockers.push('User object missing');
    return { isReady: false, blockers };
  }
  
  if (!user.user_metadata) blockers.push('User metadata missing');
  
  // Check for specific metadata fields if needed
  // if (!user.user_metadata?.role) blockers.push('User role missing');
  
  return {
    isReady: !!user && !!user.user_metadata,
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
 * Check if backend-derived organization metadata is ready
 */
export function checkOrgMetadataReadiness(
  orgContext: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!orgContext) blockers.push('Organization context not loaded');
  
  return {
    isReady: !!orgContext,
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
 * Check if all backend-derived context is ready
 */
export function checkBackendContextReadiness(
  userContext: any | null,
  orgContext: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!userContext) blockers.push('User context not loaded from backend');
  if (!orgContext) blockers.push('Organization context not loaded from backend');
  
  return {
    isReady: !!userContext && !!orgContext,
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

/**
 * Check if the context is ready for sending messages to Sage
 * This is a more stringent check than isReadyToRender
 */
export function checkReadyToSend(
  isAuthReady: boolean,
  isSessionReady: boolean,
  isOrgReady: boolean,
  isVoiceReady: boolean,
  isBackendContextReady: boolean
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!isAuthReady) blockers.push('Authentication not ready');
  if (!isSessionReady) blockers.push('Session not ready');
  if (!isOrgReady) blockers.push('Organization not ready');
  if (!isVoiceReady) blockers.push('Voice parameter not ready');
  if (!isBackendContextReady) blockers.push('Backend context not ready');
  
  const isReady = isAuthReady && isSessionReady && isOrgReady && isVoiceReady && isBackendContextReady;
  
  return {
    isReady,
    blockers
  };
}

/**
 * Create a dependency status object for tracking
 */
export function createDependencyStatus(
  name: string,
  isReady: boolean,
  priority: DependencyPriority,
  blockers: string[] = []
): DependencyStatus {
  return {
    name,
    isReady,
    priority,
    blockers,
    readySince: isReady ? Date.now() : undefined
  };
}

/**
 * Group blockers by category
 */
export function categorizeBlockers(
  authBlockers: string[] = [],
  userBlockers: string[] = [],
  orgBlockers: string[] = [],
  voiceBlockers: string[] = [],
  backendBlockers: string[] = []
): Record<string, string[]> {
  const blockersByCategory: Record<string, string[]> = {};
  
  if (authBlockers.length > 0) blockersByCategory.auth = authBlockers;
  if (userBlockers.length > 0) blockersByCategory.user = userBlockers;
  if (orgBlockers.length > 0) blockersByCategory.org = orgBlockers;
  if (voiceBlockers.length > 0) blockersByCategory.voice = voiceBlockers;
  if (backendBlockers.length > 0) blockersByCategory.backend = backendBlockers;
  
  return blockersByCategory;
}

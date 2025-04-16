
import { ReadinessCheck } from './types';

/**
 * Function to check if authentication is ready
 */
export function checkAuthReadiness(
  userId: string | null,
  isSessionUserReady: boolean
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!userId) {
    blockers.push('User ID not available');
  }
  
  if (!isSessionUserReady) {
    blockers.push('Session user not ready');
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

/**
 * Function to check if session is ready
 */
export function checkSessionReadiness(
  userId: string | null,
  isSessionUserReady: boolean,
  currentUserData: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!userId) {
    blockers.push('User ID not available for session');
  }
  
  if (!isSessionUserReady) {
    blockers.push('Session user not ready');
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

/**
 * Function to check if user metadata is ready
 */
export function checkUserMetadataReadiness(
  currentUserData: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!currentUserData) {
    blockers.push('Current user data not available');
  }
  
  if (currentUserData && !currentUserData.user_metadata) {
    blockers.push('User metadata missing');
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

/**
 * Function to check if organization is ready
 */
export function checkOrgReadiness(
  orgId: string | null,
  orgSlug: string | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!orgId) {
    blockers.push('Organization ID not available');
  }
  
  if (!orgSlug) {
    blockers.push('Organization slug not available');
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

/**
 * Function to check if organization metadata is ready
 */
export function checkOrgMetadataReadiness(
  orgContext: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!orgContext) {
    blockers.push('Organization context not available');
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

/**
 * Function to check if voice parameter is ready
 */
export function checkVoiceReadiness(
  voiceParam: string | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!voiceParam) {
    blockers.push('Voice parameter not available');
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

/**
 * Function to check if backend context is ready
 */
export function checkBackendContextReadiness(
  userContext: any | null,
  orgContext: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!userContext) {
    blockers.push('User context not available');
  }
  
  if (!orgContext) {
    blockers.push('Organization context not available');
  }
  
  return {
    isReady: !!userContext && !!orgContext,
    blockers
  };
}

/**
 * Function to check if session is stable
 */
export function checkSessionStability(
  isSessionUserReady: boolean,
  orgId: string | null,
  orgSlug: string | null,
  currentUserData: any | null
): ReadinessCheck {
  const sessionCheck = checkSessionReadiness(
    currentUserData?.id ?? null,
    isSessionUserReady,
    currentUserData
  );
  
  const orgCheck = checkOrgReadiness(
    orgId,
    orgSlug
  );
  
  const userMetadataCheck = checkUserMetadataReadiness(
    currentUserData
  );
  
  const allChecks = [
    ...sessionCheck.blockers,
    ...orgCheck.blockers,
    ...userMetadataCheck.blockers
  ];
  
  return {
    isReady: allChecks.length === 0,
    blockers: allChecks
  };
}

/**
 * Function to check if context is ready to send messages
 */
export function checkReadyToSend(
  isAuthReady: boolean,
  isSessionReady: boolean,
  isOrgReady: boolean,
  isVoiceReady: boolean,
  isBackendContextReady: boolean
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!isAuthReady) {
    blockers.push('Authentication not ready');
  }
  
  if (!isSessionReady) {
    blockers.push('Session not ready');
  }
  
  if (!isOrgReady) {
    blockers.push('Organization not ready');
  }
  
  if (!isVoiceReady) {
    blockers.push('Voice not ready');
  }
  
  if (!isBackendContextReady) {
    blockers.push('Backend context not ready');
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

/**
 * Utility to categorize blockers by type
 */
export function categorizeBlockers(
  authBlockers: string[],
  userBlockers: string[],
  orgBlockers: string[],
  voiceBlockers: string[],
  backendBlockers: string[]
): {
  auth?: string[];
  user?: string[];
  org?: string[];
  voice?: string[];
  backend?: string[];
  system?: string[];
} {
  const result: {
    auth?: string[];
    user?: string[];
    org?: string[];
    voice?: string[];
    backend?: string[];
    system?: string[];
  } = {};
  
  if (authBlockers.length > 0) {
    result.auth = authBlockers;
  }
  
  if (userBlockers.length > 0) {
    result.user = userBlockers;
  }
  
  if (orgBlockers.length > 0) {
    result.org = orgBlockers;
  }
  
  if (voiceBlockers.length > 0) {
    result.voice = voiceBlockers;
  }
  
  if (backendBlockers.length > 0) {
    result.backend = backendBlockers;
  }
  
  return result;
}

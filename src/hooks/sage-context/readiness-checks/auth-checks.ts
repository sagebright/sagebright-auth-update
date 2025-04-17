
import { ReadinessCheck } from '../types';

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
  
  // In development mode, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Suppressing some auth blockers');
    return {
      isReady: true,
      blockers: []
    };
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
  
  // In development mode, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Suppressing some session blockers');
    return {
      isReady: true,
      blockers: []
    };
  }
  
  return {
    isReady: blockers.length === 0,
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
  
  const orgCheck = {
    isReady: !!orgId && !!orgSlug,
    blockers: !orgId ? ['Organization ID not available'] : 
              !orgSlug ? ['Organization slug not available'] : []
  };
  
  const userMetadataCheck = {
    isReady: !!currentUserData?.user_metadata,
    blockers: !currentUserData ? ['Current user data not available'] :
              !currentUserData.user_metadata ? ['User metadata missing'] : []
  };
  
  const allChecks = [
    ...sessionCheck.blockers,
    ...orgCheck.blockers,
    ...userMetadataCheck.blockers
  ];
  
  // In development mode, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' && allChecks.length > 0) {
    console.info('🧪 Development mode: Treating session as stable despite blockers');
    return {
      isReady: true,
      blockers: []
    };
  }
  
  return {
    isReady: allChecks.length === 0,
    blockers: allChecks
  };
}


import { ReadinessCheck } from '../types';

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
  
  // In development mode, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Suppressing user metadata blockers');
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
  
  // Check if we have fallback context objects
  const isUserFallback = userContext && userContext._fallback === true;
  const isOrgFallback = orgContext && orgContext._fallback === true;
  
  // In development mode or with fallback contexts, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' || isUserFallback || isOrgFallback) {
    console.info('🧪 Development mode or using fallback context: Suppressing backend context blockers');
    return {
      isReady: true,
      blockers: []
    };
  }
  
  return {
    isReady: !!userContext && !!orgContext,
    blockers
  };
}

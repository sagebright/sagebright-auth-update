
import { ReadinessCheck } from '../types';

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
  
  // In development mode, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Suppressing organization blockers');
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
 * Function to check if organization metadata is ready
 */
export function checkOrgMetadataReadiness(
  orgContext: any | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!orgContext) {
    blockers.push('Organization context not available');
  }
  
  // In development mode, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Suppressing org metadata blockers');
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

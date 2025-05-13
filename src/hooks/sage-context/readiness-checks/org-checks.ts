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
  
  // In development mode, we'll be more forgiving and tolerate missing orgSlug
  if (process.env.NODE_ENV === 'development') {
    console.info('🧪 Development mode: Suppressing some organization blockers');
    
    // Only keep the orgId blocker in dev mode
    return {
      isReady: !!orgId,
      blockers: !orgId ? ['Organization ID not available'] : []
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
  
  // In development mode or after a timeout, we'll be more forgiving
  if (process.env.NODE_ENV === 'development') {
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

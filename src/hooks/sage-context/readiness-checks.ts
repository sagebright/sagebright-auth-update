
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
  
  // In development mode, provide a default voice if missing
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Using default voice parameter');
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
  
  // In development mode, we'll be more forgiving
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Suppressing backend context blockers');
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
  
  // In development mode, allow sending messages after a timeout even with issues
  if (process.env.NODE_ENV === 'development') {
    // If more than 5 seconds have passed since the page loaded, allow sending
    // This prevents being permanently stuck in loading state during development
    const pageLoadTime = window.performance?.timing?.navigationStart || 0;
    const currentTime = Date.now();
    const timeElapsed = currentTime - pageLoadTime;
    
    if (timeElapsed > 5000 && blockers.length > 0) {
      console.info('🧪 Development mode: Allowing message sending after timeout despite blockers');
      return {
        isReady: true,
        blockers: []
      };
    }
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
  
  // Ensure system category exists
  result.system = result.system || [];
  
  return result;
}


import { ReadinessCheck } from '../types';

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

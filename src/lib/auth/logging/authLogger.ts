
/**
 * Auth logging utilities
 * Handles logging with throttling for auth operations
 */

import { authCacheState } from '../cache/authStateCache';

// Logging debounce
let lastLogTime = 0;
const LOG_THROTTLE_TIME = 10000; // 10 seconds between detailed logs

/**
 * Log auth-related messages with throttling
 */
export function logIfEnabled(message: string, data?: any, force: boolean = false) {
  const now = Date.now();
  const shouldLog = force || (authCacheState.loggingEnabled && (now - lastLogTime > LOG_THROTTLE_TIME));
  
  if (shouldLog) {
    lastLogTime = now;
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
    return true;
  }
  return false;
}

/**
 * Logs auth state reset
 */
export function logAuthReset() {
  const shouldLog = Date.now() - lastLogTime > LOG_THROTTLE_TIME;
  if (shouldLog) {
    console.log("🔄 Resetting auth state cache");
    lastLogTime = Date.now();
  }
}

/**
 * Configures auth logging
 */
export function setAuthLogging(enabled: boolean) {
  authCacheState.loggingEnabled = enabled;
  console.log(`🔊 Auth logging ${enabled ? 'enabled' : 'disabled'}`);
}

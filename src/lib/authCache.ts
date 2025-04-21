
/**
 * Auth state cache/throttle utilities
 * Centralizes result cache, throttling, exponential backoff, etc.
 */

import type { AuthPayload } from "./backendAuth";

interface LastAuthCheck {
  timestamp: number;
  result: AuthPayload | null;
  pending: boolean;
  consecutiveErrors: number;
  lastErrorTime: number;
  loggingEnabled: boolean;
}

export const lastAuthCheckRef: LastAuthCheck = {
  timestamp: 0,
  result: null,
  pending: false,
  consecutiveErrors: 0,
  lastErrorTime: 0,
  loggingEnabled: true
};

// Logging debounce
let lastLogTime = 0;
const LOG_THROTTLE_TIME = 10000; // 10 seconds between detailed logs

// Used by resetAuthState and potentially test utilities
export function resetAuthStateCache() {
  const shouldLog = Date.now() - lastLogTime > LOG_THROTTLE_TIME;
  if (shouldLog) {
    console.log("🔄 Resetting auth state cache");
    lastLogTime = Date.now();
  }
  
  lastAuthCheckRef.result = null;
  lastAuthCheckRef.timestamp = 0;
  lastAuthCheckRef.pending = false;
  lastAuthCheckRef.consecutiveErrors = 0;
  lastAuthCheckRef.lastErrorTime = 0;
}

// Used for debugging or enabling/disabling auth logs
export function setAuthLogging(enabled: boolean) {
  lastAuthCheckRef.loggingEnabled = enabled;
  console.log(`🔊 Auth logging ${enabled ? 'enabled' : 'disabled'}`);
}

// Helper for throttled logging
export function logIfEnabled(message: string, data?: any, force: boolean = false) {
  const now = Date.now();
  const shouldLog = force || (lastAuthCheckRef.loggingEnabled && (now - lastLogTime > LOG_THROTTLE_TIME));
  
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

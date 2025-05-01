
/**
 * Auth state cache management
 * Handles caching of auth state to prevent unnecessary API calls
 */

import type { AuthPayload } from "../../api/auth/types";

export interface AuthCacheState {
  timestamp: number;
  result: AuthPayload | null;
  pending: boolean;
  consecutiveErrors: number;
  lastErrorTime: number;
  loggingEnabled: boolean;
}

export const authCacheState: AuthCacheState = {
  timestamp: 0,
  result: null,
  pending: false,
  consecutiveErrors: 0,
  lastErrorTime: 0,
  loggingEnabled: true
};

/**
 * Resets the auth state cache completely
 */
export function resetAuthStateCache() {
  authCacheState.result = null;
  authCacheState.timestamp = 0;
  authCacheState.pending = false;
  authCacheState.consecutiveErrors = 0;
  authCacheState.lastErrorTime = 0;
}

/**
 * Configures auth state logging - this function is now a simple pass-through
 * to maintain backwards compatibility, while the actual implementation is in authLogger.ts
 */
export function setAuthLogging(enabled: boolean) {
  authCacheState.loggingEnabled = enabled;
}

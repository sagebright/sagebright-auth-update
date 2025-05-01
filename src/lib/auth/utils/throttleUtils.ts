
/**
 * Utilities for managing request throttling and backoff
 */

import { authCacheState } from '../cache/authStateCache';
import { logIfEnabled } from '../logging/authLogger';

/**
 * Check if a request should be throttled
 */
export function shouldThrottleRequest(now: number, forceCheck: boolean): boolean {
  const throttleTime = 2000; // 2 seconds

  // Throttle checks and use cache when appropriate
  if (
    !forceCheck &&
    authCacheState.result &&
    now - authCacheState.timestamp < throttleTime
  ) {
    logIfEnabled(`🔄 Using cached auth check from last ${now - authCacheState.timestamp}ms`, null, false);
    return true;
  }

  return false;
}

/**
 * Check if duplicate request is already in progress
 */
export function isDuplicateRequest(forceCheck: boolean): boolean {
  if (authCacheState.pending && !forceCheck) {
    logIfEnabled("🔄 Auth fetch already in progress, skipping duplicate", null, false);
    return true;
  }
  return false;
}

/**
 * Determine if backoff should be applied
 */
export function shouldApplyBackoff(now: number, forceCheck: boolean): boolean {
  if (authCacheState.consecutiveErrors > 0 && !forceCheck) {
    const timeSinceLastError = now - authCacheState.lastErrorTime;
    const backoffTime = Math.min(
      1000 * Math.pow(2, authCacheState.consecutiveErrors - 1),
      30000
    );
    if (timeSinceLastError < backoffTime) {
      logIfEnabled(
        `🔄 Backing off auth fetch for ${backoffTime - timeSinceLastError}ms due to ${authCacheState.consecutiveErrors} consecutive errors`,
        null,
        false
      );
      return true;
    }
  }
  return false;
}

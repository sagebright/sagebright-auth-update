
/**
 * Core Auth API Functions
 * Provides authentication functionality with improved error handling and response parsing
 */

import { hasAuthCookie } from "./auth/cookies/cookieDetection";
import { authCacheState, resetAuthStateCache } from "./auth/cache/authStateCache";
import { logIfEnabled, logAuthReset } from "./auth/logging/authLogger";
import { makeAuthFetch } from "./auth/utils/fetchUtils";
import { shouldThrottleRequest, isDuplicateRequest, shouldApplyBackoff } from "./auth/utils/throttleUtils";
import { createEmptyAuthPayload } from "./auth/utils/emptyStateUtils";
import type { AuthPayload } from "./api/auth/types";

// Define the base URL for all backend API requests
const API_BASE_URL = 'https://sagebright-backend.up.railway.app';

/**
 * Fetches authentication data from the server
 */
export async function fetchAuth(options: { forceCheck?: boolean } = {}): Promise<AuthPayload> {
  const { forceCheck = false } = options;
  const now = Date.now();

  // Check cache and throttle first
  if (shouldThrottleRequest(now, forceCheck) && authCacheState.result) {
    return authCacheState.result;
  }

  // Check for duplicate requests
  if (isDuplicateRequest(forceCheck)) {
    return authCacheState.result || createEmptyAuthPayload();
  }

  // Only log fetch calls if forced or infrequent
  logIfEnabled("🔄 fetchAuth called", { forceCheck }, forceCheck);

  // Skip if no auth cookie and not forced
  if (shouldSkipAuthRequest(forceCheck)) {
    authCacheState.result = createEmptyAuthPayload();
    authCacheState.timestamp = now;
    return authCacheState.result;
  }

  // Apply backoff strategy for errors
  if (shouldApplyBackoff(now, forceCheck)) {
    return authCacheState.result || createEmptyAuthPayload();
  }

  // Use absolute URL for direct API request to Railway backend
  const url = '/api/auth/session';
  const absoluteUrl = `${API_BASE_URL}/auth/session`;
  logIfEnabled(`🔍 Fetching auth session from: ${absoluteUrl}`, null, forceCheck);

  try {
    authCacheState.pending = true;
    logIfEnabled("🔍 Starting fetch request with credentials included", null, false);
    
    const responseData = await makeAuthFetch(url);
    
    // Check if we got a fallback response due to HTML content
    if (responseData?.fallback) {
      console.warn("⚠️ Received fallback auth payload due to HTML response. API may be misconfigured.");
    } else {
      logIfEnabled("✅ Auth session data received:", {
        hasSession: !!responseData?.session,
        hasUser: !!responseData?.user,
        hasOrg: !!responseData?.org
      }, forceCheck);
    }
    
    // Update cache state on success
    updateCacheOnSuccess(responseData, now);
    return responseData;
  } catch (error) {
    // Handle error and update cache state
    handleFetchError(error, now);
    throw error;
  }
}

/**
 * Determine if auth request should be skipped
 */
function shouldSkipAuthRequest(forceCheck: boolean): boolean {
  const hasCookie = hasAuthCookie();

  if (!forceCheck && !hasCookie) {
    // Only warn about missing cookie if forced
    if (forceCheck) {
      console.warn("🔄 No auth cookie detected, skipping session fetch");
    }
    return true;
  }
  
  return false;
}

/**
 * Update cache state on successful fetch
 */
function updateCacheOnSuccess(responseData: AuthPayload, timestamp: number): void {
  authCacheState.consecutiveErrors = 0;
  authCacheState.result = responseData;
  authCacheState.timestamp = timestamp;
  authCacheState.pending = false;
}

/**
 * Handle fetch errors and update cache state
 */
function handleFetchError(error: unknown, timestamp: number): void {
  console.error("❌ Auth fetch request failed:", error);
  
  // Check if this is a content type error (HTML instead of JSON)
  const isContentTypeError = error instanceof Error && 
    error.message.includes('Expected JSON response');
  
  if (isContentTypeError) {
    console.warn("⚠️ API returned HTML instead of JSON. This may indicate a misconfiguration.");
  }
  
  authCacheState.consecutiveErrors++;
  authCacheState.lastErrorTime = timestamp;
  authCacheState.pending = false;
}

/**
 * Checks if the current session is valid
 * @returns Promise resolving to a boolean indicating if the session is valid
 */
export async function checkAuth(): Promise<boolean> {
  logIfEnabled("🔍 Starting auth check", null, false);
  try {
    // Use forceCheck for explicit auth checks
    const authData = await fetchAuth({ forceCheck: true });
    const isValid = !!authData.session?.id;
    logIfEnabled("🔍 Auth check result:", { isValid }, false);
    return isValid;
  } catch (err) {
    console.error('Auth check failed:', err);
    return false;
  }
}

/**
 * Resets the auth state cache
 */
export function resetAuthState() {
  resetAuthStateCache();
  logAuthReset();
}

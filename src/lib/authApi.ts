
/**
 * Core Auth API Functions
 * Provides authentication functionality with improved error handling and response parsing
 */

import { hasAuthCookie } from "./authCookies";
import { lastAuthCheckRef, resetAuthStateCache, logIfEnabled } from "./authCache";

export interface AuthPayload {
  session: { id: string; expiresAt: string };
  user: { id: string; role: string };
  org: { id: string; slug: string };
}

/**
 * Response handler for auth API calls
 */
const handleAuthResponse = async (res: Response): Promise<any> => {
  logIfEnabled("🔍 Auth session response:", {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    contentType: res.headers.get('content-type'),
    url: res.url
  }, res.ok);

  if (!res.ok) {
    if (res.status === 401) {
      logIfEnabled("🔍 Auth session returned 401 - Not authenticated (expected if not logged in)", null, false);
      return null;
    }
    
    let errorText = '';
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorText = JSON.stringify(errorData);
      } else {
        errorText = await res.text();
      }
    } catch (parseErr) {
      errorText = 'Could not parse error response';
    }
    
    throw new Error(`Auth fetch failed: ${res.status} ${errorText}`);
  }

  // Check for correct content type
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Auth session response is not JSON:', contentType);
    try {
      const text = await res.text();
      console.error('Response text (first 200 chars):', text.substring(0, 200));
    } catch (textErr) {
      console.error('Could not get response text:', textErr);
    }
    throw new Error('Expected JSON response but received: ' + contentType);
  }

  try {
    return await res.json();
  } catch (parseError) {
    console.error("❌ Failed to parse JSON from auth response:", parseError);
    throw new Error(`Failed to parse auth response: ${parseError}`);
  }
};

/**
 * Make authenticated API request with proper error handling
 */
const makeAuthRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return await handleAuthResponse(res);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("❌ Auth fetch request timed out after 10 seconds");
      throw new Error("Auth request timed out. Please try again.");
    }
    throw error;
  }
};

/**
 * Fetches authentication data from the server
 */
export async function fetchAuth(options: { forceCheck?: boolean } = {}): Promise<AuthPayload> {
  const { forceCheck = false } = options;
  const now = Date.now();
  const throttleTime = 2000; // 2 seconds

  // Throttle checks and use cache when appropriate
  if (
    !forceCheck &&
    lastAuthCheckRef.result &&
    now - lastAuthCheckRef.timestamp < throttleTime
  ) {
    logIfEnabled(`🔄 Using cached auth check from last ${now - lastAuthCheckRef.timestamp}ms`, null, false);
    return lastAuthCheckRef.result;
  }

  if (lastAuthCheckRef.pending && !forceCheck) {
    logIfEnabled("🔄 Auth fetch already in progress, skipping duplicate", null, false);
    if (lastAuthCheckRef.result) {
      return lastAuthCheckRef.result;
    }
    return createEmptyAuthPayload();
  }

  // Only log fetch calls if forced or infrequent
  logIfEnabled("🔄 fetchAuth called", { forceCheck }, forceCheck);

  const hasCookie = hasAuthCookie();

  if (!forceCheck && !hasCookie) {
    // Only warn about missing cookie once or when forced
    if (forceCheck) {
      console.warn("🔄 No auth cookie detected, skipping session fetch");
    }
    
    lastAuthCheckRef.result = createEmptyAuthPayload();
    lastAuthCheckRef.timestamp = now;
    return lastAuthCheckRef.result;
  }

  // Apply backoff strategy for errors
  if (shouldApplyBackoff(now, forceCheck)) {
    const result = lastAuthCheckRef.result || createEmptyAuthPayload();
    return result;
  }

  // Always use relative URL for API request
  const url = '/api/auth/session';
  logIfEnabled(`🔍 Fetching auth session from: ${url}`, null, forceCheck);

  try {
    lastAuthCheckRef.pending = true;
    logIfEnabled("🔍 Starting fetch request with credentials included", null, false);
    
    const responseData = await makeAuthRequest(url);
    
    logIfEnabled("✅ Auth session data received:", {
      hasSession: !!responseData?.session,
      hasUser: !!responseData?.user,
      hasOrg: !!responseData?.org
    }, forceCheck);
    
    lastAuthCheckRef.consecutiveErrors = 0;
    lastAuthCheckRef.result = responseData;
    lastAuthCheckRef.timestamp = now;
    lastAuthCheckRef.pending = false;
    return responseData;
  } catch (error) {
    console.error("❌ Auth fetch request failed:", error);
    lastAuthCheckRef.consecutiveErrors++;
    lastAuthCheckRef.lastErrorTime = now;
    lastAuthCheckRef.pending = false;
    throw error;
  }
}

/**
 * Helper function to determine if backoff should be applied
 */
function shouldApplyBackoff(now: number, forceCheck: boolean): boolean {
  if (lastAuthCheckRef.consecutiveErrors > 0 && !forceCheck) {
    const timeSinceLastError = now - lastAuthCheckRef.lastErrorTime;
    const backoffTime = Math.min(
      1000 * Math.pow(2, lastAuthCheckRef.consecutiveErrors - 1),
      30000
    );
    if (timeSinceLastError < backoffTime) {
      logIfEnabled(
        `🔄 Backing off auth fetch for ${backoffTime - timeSinceLastError}ms due to ${lastAuthCheckRef.consecutiveErrors} consecutive errors`,
        null,
        false
      );
      return true;
    }
  }
  return false;
}

/**
 * Creates an empty auth payload for unauthenticated states
 */
function createEmptyAuthPayload(): AuthPayload {
  return {
    session: null as any,
    user: null as any,
    org: null as any
  };
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
}

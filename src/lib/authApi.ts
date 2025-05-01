
/**
 * Core Auth API Functions: fetchAuth, checkAuth, resetAuthState
 * This file composes cookie, cache, and remote logic
 */

import { hasAuthCookie } from "./authCookies";
import { lastAuthCheckRef, resetAuthStateCache, logIfEnabled } from "./authCache";

export interface AuthPayload {
  session: { id: string; expiresAt: string };
  user: { id: string; role: string };
  org: { id: string; slug: string };
}

// -- fetchAuth implementation (unchanged logic) --
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
    return {
      session: null as any,
      user: null as any,
      org: null as any
    };
  }

  // Only log fetch calls if forced or infrequent
  logIfEnabled("🔄 fetchAuth called", { forceCheck }, forceCheck);

  const hasCookie = hasAuthCookie();

  if (!forceCheck && !hasCookie) {
    // Only warn about missing cookie once or when forced
    if (forceCheck) {
      console.warn("🔄 No auth cookie detected, skipping session fetch");
    }
    
    lastAuthCheckRef.result = {
      session: null as any,
      user: null as any,
      org: null as any
    };
    lastAuthCheckRef.timestamp = now;
    return lastAuthCheckRef.result;
  }

  // Exponential backoff for consecutive errors
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
      if (lastAuthCheckRef.result) {
        return lastAuthCheckRef.result;
      }
      return {
        session: null as any,
        user: null as any,
        org: null as any
      };
    }
  }

  // Always use relative URL for API request
  const url = '/api/auth/session';
  logIfEnabled(`🔍 Fetching auth session from: ${url}`, null, forceCheck);

  try {
    lastAuthCheckRef.pending = true;
    logIfEnabled("🔍 Starting fetch request with credentials included", null, false);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Only log detailed response info if it's successful or a new error
      const isFirstError = lastAuthCheckRef.consecutiveErrors === 0;
      logIfEnabled("🔍 Auth session response:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        contentType: res.headers.get('content-type'),
        url: res.url
      }, res.ok || isFirstError);

      if (!res.ok) {
        let errorText;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            
            // Only log error data on first failure or forced checks
            if (isFirstError || forceCheck) {
              console.error('Auth fetch error data:', errorData);
            }
            
            errorText = JSON.stringify(errorData);
          } else {
            errorText = await res.text();
            if (isFirstError || forceCheck) {
              console.error('Auth fetch error text:', errorText.substring(0, 200));
            }
          }
        } catch (parseErr) {
          errorText = 'Could not parse error response';
          console.error('Error parsing auth error response:', parseErr);
        }
        if (res.status === 401) {
          // Only log expected 401 errors occasionally
          logIfEnabled("🔍 Auth session returned 401 - Not authenticated (expected if not logged in)", null, isFirstError);
          lastAuthCheckRef.consecutiveErrors = 0;
          const result = {
            session: null as any,
            user: null as any,
            org: null as any
          };
          lastAuthCheckRef.result = result;
          lastAuthCheckRef.timestamp = now;
          lastAuthCheckRef.pending = false;
          return result;
        }
        lastAuthCheckRef.consecutiveErrors++;
        lastAuthCheckRef.lastErrorTime = now;
        lastAuthCheckRef.pending = false;
        const error = `Auth fetch failed: ${res.status} ${errorText}`;
        console.error(error);
        throw new Error(error);
      }

      // Check for correct content type
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Auth session response is not JSON:', contentType);
        if (isFirstError || forceCheck) {
          try {
            const text = await res.text();
            console.error('Response text (first 200 chars):', text.substring(0, 200));
          } catch (textErr) {
            console.error('Could not get response text:', textErr);
          }
        }
        lastAuthCheckRef.consecutiveErrors++;
        lastAuthCheckRef.lastErrorTime = now;
        lastAuthCheckRef.pending = false;
        throw new Error('Expected JSON response but received: ' + contentType);
      }

      try {
        const responseData = await res.json();
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
      } catch (parseError) {
        console.error("❌ Failed to parse JSON from auth response:", parseError);
        lastAuthCheckRef.consecutiveErrors++;
        lastAuthCheckRef.lastErrorTime = now;
        lastAuthCheckRef.pending = false;
        throw new Error(`Failed to parse auth response: ${parseError}`);
      }
    } catch (abortError) {
      if (abortError.name === 'AbortError') {
        console.error("❌ Auth fetch request timed out after 10 seconds");
        lastAuthCheckRef.consecutiveErrors++;
        lastAuthCheckRef.lastErrorTime = now;
        throw new Error("Auth request timed out. Please try again.");
      }
      throw abortError;
    }
  } catch (fetchError) {
    console.error("❌ Auth fetch request failed:", fetchError);
    lastAuthCheckRef.consecutiveErrors++;
    lastAuthCheckRef.lastErrorTime = now;
    lastAuthCheckRef.pending = false;
    throw fetchError;
  }
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

// Re-export for compat
export function resetAuthState() {
  resetAuthStateCache();
}

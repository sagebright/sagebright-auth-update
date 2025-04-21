/**
 * Core Auth API Functions: fetchAuth, checkAuth, resetAuthState
 * This file composes cookie, cache, and remote logic
 */

import { hasAuthCookie } from "./authCookies";
import { lastAuthCheckRef, resetAuthStateCache } from "./authCache";

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

  if (
    !forceCheck &&
    lastAuthCheckRef.result &&
    now - lastAuthCheckRef.timestamp < throttleTime
  ) {
    console.log(`🔄 Using cached auth check from last ${now - lastAuthCheckRef.timestamp}ms`);
    return lastAuthCheckRef.result;
  }

  if (lastAuthCheckRef.pending && !forceCheck) {
    console.log("🔄 Auth fetch already in progress, skipping duplicate");
    if (lastAuthCheckRef.result) {
      return lastAuthCheckRef.result;
    }
    return {
      session: null as any,
      user: null as any,
      org: null as any
    };
  }

  console.log("🔄 fetchAuth called with options:", { forceCheck });

  const hasCookie = hasAuthCookie();

  if (!forceCheck && !hasCookie) {
    console.warn("🔄 No auth cookie detected, skipping session fetch");
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
      console.log(
        `🔄 Backing off auth fetch for ${backoffTime - timeSinceLastError}ms due to ${lastAuthCheckRef.consecutiveErrors} consecutive errors`
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

  const BASE = import.meta.env.VITE_BACKEND_URL || '';
  const url = `${BASE}/api/auth/session`;
  console.log(`🔍 Fetching auth session from: ${url}`);

  try {
    lastAuthCheckRef.pending = true;
    console.log("🔍 Starting fetch request with credentials included");
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

      console.log("🔍 Auth session response:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        contentType: res.headers.get('content-type'),
        url: res.url
      });

      if (!res.ok) {
        let errorText;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            console.error('Auth fetch error data:', errorData);
            errorText = JSON.stringify(errorData);
          } else {
            errorText = await res.text();
            console.error('Auth fetch error text:', errorText.substring(0, 200));
          }
        } catch (parseErr) {
          errorText = 'Could not parse error response';
          console.error('Error parsing auth error response:', parseErr);
        }
        if (res.status === 401) {
          console.log("🔍 Auth session returned 401 - Not authenticated (expected if not logged in)");
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

      try {
        const responseData = await res.json();
        console.log("✅ Auth session data received:", {
          hasSession: !!responseData?.session,
          hasUser: !!responseData?.user,
          hasOrg: !!responseData?.org
        });
        lastAuthCheckRef.consecutiveErrors = 0;
        lastAuthCheckRef.result = responseData;
        lastAuthCheckRef.timestamp = now;
        lastAuthCheckRef.pending = false;
        return responseData;
      } catch (parseError) {
        console.error("❌ Failed to parse JSON from auth response:", parseError);
        try {
          const textResponse = await res.clone().text();
          console.log("📄 Raw response text:", textResponse.substring(0, 200));
        } catch (textError) {
          console.error("❌ Could not get text response either:", textError);
        }
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
  console.log("🔍 Starting auth check");
  try {
    // Use forceCheck for explicit auth checks
    const authData = await fetchAuth({ forceCheck: true });
    const isValid = !!authData.session?.id;
    console.log("🔍 Auth check result:", { isValid });
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

import { hasAuthCookie } from "./authCookies";
import { lastAuthCheckRef, resetAuthStateCache, logIfEnabled } from "./authCache";

export interface AuthPayload {
  session: { id: string; expiresAt: string };
  user: { id: string; role: string };
  org: { id: string; slug: string };
}

// -- fetchAuth implementation with enhanced error handling --
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

  // Get the configured BASE_URL or fall back to empty string
  const BASE = import.meta.env.VITE_BACKEND_URL || '';
  const url = `${BASE}/api/auth/session`;
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

      // Enhanced response logging to better diagnose issues
      const responseContentType = res.headers.get('content-type') || 'unknown';
      const responseDetails = {
        status: res.status,
        statusText: res.statusText || 'no status text',
        ok: res.ok,
        contentType: responseContentType,
        url: res.url,
        isJson: responseContentType.includes('application/json'),
        isHtml: responseContentType.includes('text/html')
      };
      
      // Log more details for better debugging
      console.log("🔍 Detailed auth session response:", responseDetails);

      if (!res.ok) {
        // Handle error responses
        let errorText;
        try {
          if (responseContentType.includes('application/json')) {
            const errorData = await res.json();
            console.error('Auth fetch error data:', errorData);
            errorText = JSON.stringify(errorData);
          } else {
            // For HTML or other non-JSON responses, get the first 300 chars to see if it's an error page
            errorText = await res.text();
            console.error('Auth fetch non-JSON response:', errorText.substring(0, 300));
            throw new Error(`Server returned non-JSON response: ${errorText.substring(0, 100)}...`);
          }
        } catch (parseErr) {
          errorText = 'Could not parse error response';
          console.error('Error parsing auth error response:', parseErr);
        }
        if (res.status === 401) {
          logIfEnabled("🔍 Auth session returned 401 - Not authenticated (expected if not logged in)", null, true);
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

      // *** CRITICAL FIX: Handle HTML responses from auth endpoint ***
      if (responseContentType.includes('text/html')) {
        console.warn('⚠️ Auth API returned HTML instead of JSON. This is typically a backend misconfiguration.');
        console.warn('⚠️ The backend needs to be configured to return JSON for API endpoints.');
        
        // Create a fallback response to avoid breaking the app
        lastAuthCheckRef.result = {
          session: null as any,
          user: null as any,
          org: null as any
        };
        lastAuthCheckRef.timestamp = now;
        lastAuthCheckRef.pending = false;
        lastAuthCheckRef.consecutiveErrors++;
        lastAuthCheckRef.lastErrorTime = now;
        
        // Return a structured error that can be handled by the UI
        return lastAuthCheckRef.result;
      }

      try {
        // When response is OK, try to parse as JSON with better error handling
        if (!responseContentType.includes('application/json')) {
          // If not JSON but still OK, this could be a misconfiguration
          console.warn('Server returned non-JSON content type but status OK:', responseContentType);
          
          // Try to parse as JSON anyway (some servers mis-report content type)
          try {
            const responseData = await res.json();
            console.log("✅ Successfully parsed response despite incorrect content type");
            lastAuthCheckRef.consecutiveErrors = 0;
            lastAuthCheckRef.result = responseData;
            lastAuthCheckRef.timestamp = now;
            lastAuthCheckRef.pending = false;
            return responseData;
          } catch (jsonError) {
            // If it's not valid JSON, try to get text for debugging
            const textResponse = await res.text();
            console.error('Non-JSON response preview:', textResponse.substring(0, 300));
            throw new Error(`Server returned OK status but non-JSON content: ${textResponse.substring(0, 100)}...`);
          }
        }
        
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
        
        // Try to get the raw text for better debugging
        try {
          // Can't use res.clone() here if body is already used
          // Instead, log the error and throw a more descriptive error
          console.error("❌ JSON parse error details:", {
            message: parseError.message,
            contentType: responseContentType,
            status: res.status
          });
        } catch (textError) {
          console.error("❌ Could not get text response:", textError);
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

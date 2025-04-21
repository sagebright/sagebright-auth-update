
/**
 * Backend authentication client for Sagebright
 * Provides typed interfaces and methods for interacting with the backend auth API
 */

export interface AuthPayload {
  session: { id: string; expiresAt: string };
  user: { id: string; role: string };
  org: { id: string; slug: string };
}

/**
 * Basic function to check for the presence of auth cookies
 * @returns Boolean indicating if auth cookie exists
 */
export function hasAuthCookie(): boolean {
  // Look for session cookie based on the likely pattern used by the backend
  const cookies = document.cookie.split(';').map(c => c.trim());
  const authCookiePatterns = ['sb-access-token', 'session-token', 'auth-token', 'auth.token'];
  
  const cookieExists = authCookiePatterns.some(pattern => 
    cookies.some(cookie => cookie.startsWith(`${pattern}=`))
  );
  
  console.log("🍪 Auth cookie check:", { 
    exists: cookieExists, 
    cookies: document.cookie.length > 100 ? 
      document.cookie.substring(0, 100) + '...' : 
      document.cookie,
    allCookies: cookies.join(', ')
  });
  
  return cookieExists;
}

/**
 * Fetches the current authentication state from the backend
 * @param options Configuration options
 * @returns Promise resolving to the authentication payload
 * @throws Error if the authentication request fails
 */
export async function fetchAuth(options: { forceCheck?: boolean } = {}): Promise<AuthPayload> {
  const { forceCheck = false } = options;
  console.log("🔄 fetchAuth called with options:", { forceCheck });
  
  // Skip the fetch if no auth cookie is present and not forcing a check
  if (!forceCheck && !hasAuthCookie()) {
    console.warn("🔄 No auth cookie detected, skipping session fetch");
    return {
      session: null as any,
      user: null as any,
      org: null as any
    };
  }
  
  const BASE = import.meta.env.VITE_BACKEND_URL || '';
  const url = `${BASE}/api/auth/session`;
  console.log(`🔍 Fetching auth session from: ${url}`);
  
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log("🔍 Auth session response:", { 
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      contentType: res.headers.get('content-type'),
      url: res.url
    });
    
    if (!res.ok) {
      // Attempt to get detailed error information
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
      return responseData;
    } catch (parseError) {
      console.error("❌ Failed to parse JSON from auth response:", parseError);
      // Try to get the text response for debugging
      try {
        const textResponse = await res.clone().text();
        console.log("📄 Raw response text:", textResponse.substring(0, 200));
      } catch (textError) {
        console.error("❌ Could not get text response either:", textError);
      }
      throw new Error(`Failed to parse auth response: ${parseError}`);
    }
  } catch (fetchError) {
    console.error("❌ Auth fetch request failed:", fetchError);
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

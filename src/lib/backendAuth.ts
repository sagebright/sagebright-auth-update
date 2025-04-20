
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
  
  // Check if any auth cookie patterns exist
  return authCookiePatterns.some(pattern => 
    cookies.some(cookie => cookie.startsWith(`${pattern}=`))
  );
}

/**
 * Fetches the current authentication state from the backend
 * @param options Configuration options
 * @returns Promise resolving to the authentication payload
 * @throws Error if the authentication request fails
 */
export async function fetchAuth(options: { forceCheck?: boolean } = {}): Promise<AuthPayload> {
  const { forceCheck = false } = options;
  
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
  const res = await fetch(`${BASE}/api/auth/session`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
  
  if (!res.ok) {
    const error = await res.text().catch(() => 'Unknown error');
    console.error('Auth fetch failed:', error);
    throw new Error(`Auth fetch failed: ${res.status} ${error}`);
  }
  
  return res.json();
}

/**
 * Checks if the current session is valid
 * @returns Promise resolving to a boolean indicating if the session is valid
 */
export async function checkAuth(): Promise<boolean> {
  try {
    // Use forceCheck for explicit auth checks
    const authData = await fetchAuth({ forceCheck: true });
    return !!authData.session?.id;
  } catch (err) {
    console.error('Auth check failed:', err);
    return false;
  }
}

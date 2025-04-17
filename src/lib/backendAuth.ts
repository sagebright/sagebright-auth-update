
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
 * Fetches the current authentication state from the backend
 * @returns Promise resolving to the authentication payload
 * @throws Error if the authentication request fails
 */
export async function fetchAuth(): Promise<AuthPayload> {
  const res = await fetch('/api/auth/session', { 
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
    await fetchAuth();
    return true;
  } catch (err) {
    console.error('Auth check failed:', err);
    return false;
  }
}

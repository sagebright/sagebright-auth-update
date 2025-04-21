
import { handleApiError } from '../handleApiError';
import { AuthPayload } from '../backendAuth';
import { toast } from '@/hooks/use-toast';

/**
 * API helpers for authentication endpoints
 */

/**
 * Fetches the current authentication session from the backend
 * @returns Promise with auth payload
 */
export async function getAuthSession(): Promise<AuthPayload> {
  console.log("📡 Getting auth session from API");
  try {
    const BASE = import.meta.env.VITE_BACKEND_URL || '';
    const response = await fetch(`${BASE}/api/auth/session`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    console.log("📡 Auth session response:", { 
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get('content-type')
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Auth session fetch failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, { context: 'auth-session' });
    throw error;
  }
}

/**
 * Signs in a user with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with auth data
 */
export async function signIn(email: string, password: string): Promise<any> {
  console.log("📡 Signing in user:", email);
  try {
    const BASE = import.meta.env.VITE_BACKEND_URL || '';
    const response = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    console.log("📡 Sign-in response:", { 
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      let errorMessage = 'Error signing in';
      try {
        const errorData = await response.json();
        console.error("📡 Sign-in error data:", errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.error("📡 Could not parse error response:", e);
        try {
          const text = await response.text();
          console.log("📡 Error response text:", text);
        } catch (textError) {
          console.error("📡 Could not get error text either:", textError);
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, { context: 'signin' });
    throw error;
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  console.log("📡 Signing out user");
  try {
    const BASE = import.meta.env.VITE_BACKEND_URL || '';
    const response = await fetch(`${BASE}/api/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });

    console.log("📡 Sign-out response:", { 
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error signing out');
    }
  } catch (error) {
    handleApiError(error, { context: 'signout' });
    throw error;
  }
}

/**
 * Signs up a new user
 * @param email User email
 * @param password User password
 * @param fullName User's full name
 */
export async function signUp(
  email: string, 
  password: string, 
  fullName: string
): Promise<void> {
  console.log("📡 Signing up new user:", email);
  try {
    const BASE = import.meta.env.VITE_BACKEND_URL || '';
    const response = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    console.log("📡 Sign-up response:", { 
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error signing up');
    }
  } catch (error) {
    handleApiError(error, { context: 'signup' });
    throw error;
  }
}

/**
 * Sends a password reset email
 * @param email User email
 */
export async function resetPassword(email: string): Promise<void> {
  console.log("📡 Requesting password reset for:", email);
  try {
    const BASE = import.meta.env.VITE_BACKEND_URL || '';
    const response = await fetch(`${BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log("📡 Password reset response:", { 
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error resetting password');
    }
  } catch (error) {
    handleApiError(error, { context: 'password-reset' });
    throw error;
  }
}

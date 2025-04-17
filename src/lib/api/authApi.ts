
import { handleApiError } from '../handleApiError';
import { AuthPayload } from '../backendAuth';

/**
 * API helpers for authentication endpoints
 */

/**
 * Fetches the current authentication session from the backend
 * @returns Promise with auth payload
 */
export async function getAuthSession(): Promise<AuthPayload> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
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
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error signing in');
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
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
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
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName }),
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
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
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

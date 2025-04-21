import { handleApiError } from '../handleApiError';
import { AuthPayload } from '../backendAuth';
import { toast } from '@/hooks/use-toast';

/**
 * API helpers for authentication endpoints
 */

// Keep track of active API calls to prevent duplicates
const activeAuthCalls = {
  session: false,
  login: false
};

/**
 * Fetches the current authentication session from the backend
 * @returns Promise with auth payload
 */
export async function getAuthSession(): Promise<AuthPayload> {
  // Prevent duplicate calls
  if (activeAuthCalls.session) {
    console.log("📡 Auth session fetch already in progress, skipping duplicate");
    return {
      session: null as any,
      user: null as any,
      org: null as any
    };
  }
  
  console.log("📡 Getting auth session from API");
  activeAuthCalls.session = true;
  
  try {
    const BASE = import.meta.env.VITE_BACKEND_URL || '';
    const url = `${BASE}/api/auth/session`;
    console.log(`📡 Fetching auth session from: ${url}`);
    
    const response = await fetch(url, {
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
      if (response.status === 401) {
        console.log("📡 Auth session returned 401 - Not authenticated yet");
        return {
          session: null as any,
          user: null as any,
          org: null as any
        };
      }

      let errorText = '';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Auth fetch error data:', errorData);
          errorText = JSON.stringify(errorData);
        } else {
          errorText = await response.text();
          console.error('Auth fetch error text:', errorText.substring(0, 200));
        }
      } catch (parseErr) {
        errorText = 'Could not parse error response';
      }

      throw new Error(`Auth session fetch failed: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error, { context: 'auth-session' });
    throw error;
  } finally {
    activeAuthCalls.session = false;
  }
}

/**
 * Signs in a user with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with auth data
 */
export async function signIn(email: string, password: string): Promise<any> {
  // Prevent duplicate login attempts
  if (activeAuthCalls.login) {
    console.log("📡 Login already in progress, skipping duplicate");
    throw new Error("A login attempt is already in progress");
  }
  
  console.log("📡 Signing in user:", email);
  activeAuthCalls.login = true;
  
  try {
    const BASE = import.meta.env.VITE_BACKEND_URL || '';
    console.log(`📡 Preparing sign-in request: ${BASE}/api/auth/login`);
    
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
      ok: response.ok,
      statusText: response.statusText
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
    handleApiError(error, { context: 'signin', showToast: true });
    throw error;
  } finally {
    activeAuthCalls.login = false;
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
      let errorMessage = 'Error signing out';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
      throw new Error(errorMessage);
    }
    
    // Clear any cookies
    console.log("📡 Signed out successfully, clearing local state");
  } catch (error) {
    handleApiError(error, { context: 'signout', showToast: true });
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
      let errorMessage = 'Error signing up';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    handleApiError(error, { context: 'signup', showToast: true });
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
      let errorMessage = 'Error resetting password';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    handleApiError(error, { context: 'password-reset', showToast: true });
    throw error;
  }
}

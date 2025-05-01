
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

// Track the last login attempt timestamp to prevent rapid re-tries
let lastLoginAttempt = 0;
const MIN_LOGIN_INTERVAL = 2000; // 2 seconds

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
    // Always use relative URLs for API requests to ensure proxy works
    const url = '/api/auth/session';
    
    console.log(`📡 Auth session fetch using URL: ${url}`);
    
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

    // Check for correct content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Auth session response is not JSON:', contentType);
      const text = await response.text();
      console.error('Response text (first 200 chars):', text.substring(0, 200));
      throw new Error('Expected JSON response but received: ' + contentType);
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
  // Check for throttling based on last attempt
  const now = Date.now();
  if (now - lastLoginAttempt < MIN_LOGIN_INTERVAL) {
    console.log(`📡 Login attempted too soon after previous attempt (${now - lastLoginAttempt}ms), throttling`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
  }
  
  // Prevent duplicate login attempts
  if (activeAuthCalls.login) {
    console.log("📡 Login already in progress, skipping duplicate");
    throw new Error("A login attempt is already in progress");
  }
  
  lastLoginAttempt = now;
  console.log("📡 Signing in user:", email);
  activeAuthCalls.login = true;
  
  try {
    // Use relative URL for API request
    const loginEndpoint = '/api/auth/login';
    console.log(`📡 Preparing sign-in request to: ${loginEndpoint}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

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
      
      // Try to parse the response as JSON
      try {
        return await response.json();
      } catch (jsonError) {
        console.log("📡 Response is not JSON, might be empty success response");
        // If we can't parse as JSON but the request was successful, return a simple success object
        return { success: true };
      }
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        console.error("📡 Login request timed out after 15 seconds");
        throw new Error("Login request timed out. Please try again.");
      }
      throw fetchError;
    }
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
    // Use relative URL for API request
    const response = await fetch('/api/auth/signout', {
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
    // Use relative URL for API request
    const response = await fetch('/api/auth/signup', {
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
    // Use relative URL for API request
    const response = await fetch('/api/auth/reset-password', {
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

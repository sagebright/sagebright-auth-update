
/**
 * API helpers for authentication endpoints
 * Provides clean interface for auth-related API operations
 */

import { handleApiError } from '../handleApiError';
import { AuthPayload } from '../backendAuth';
import { toast } from '@/hooks/use-toast';

// Track active API calls to prevent duplicates
const activeAuthCalls = new Map<string, boolean>();

// Track the last login attempt timestamp to prevent rapid re-tries
let lastLoginAttempt = 0;
const MIN_LOGIN_INTERVAL = 2000; // 2 seconds

/**
 * Base function for making authenticated API requests
 */
async function makeAuthApiRequest(url: string, options: RequestInit = {}) {
  const endpoint = url.split('/').pop() || url;
  
  // Prevent duplicate calls
  if (activeAuthCalls.get(endpoint)) {
    console.log(`📡 ${endpoint} request already in progress, skipping duplicate`);
    return null;
  }
  
  console.log(`📡 Making auth API request to: ${url}`);
  activeAuthCalls.set(endpoint, true);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      },
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    console.log(`📡 ${endpoint} response:`, { 
      status: response.status,
      ok: response.ok
    });

    return processApiResponse(response, endpoint);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`📡 ${endpoint} request timed out after 15 seconds`);
      throw new Error(`Request timed out. Please try again.`);
    }
    throw error;
  } finally {
    activeAuthCalls.set(endpoint, false);
  }
}

/**
 * Process API responses with proper error handling
 */
async function processApiResponse(response: Response, context: string) {
  if (!response.ok) {
    let errorMessage = `Error with ${context}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const text = await response.text();
        console.error(`${context} error text:`, text.substring(0, 200));
      }
    } catch (e) {
      console.error(`Could not parse ${context} error response:`, e);
    }
    throw new Error(errorMessage);
  }
  
  // Check for JSON responses
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // Non-JSON success response (common for some auth endpoints)
    console.log(`📡 Response from ${context} is not JSON, returning success object`);
    return { success: true };
  } catch (jsonError) {
    console.error(`📡 Failed to parse ${context} response:`, jsonError);
    // If we can't parse as JSON but the request was successful, return a simple success object
    return { success: true };
  }
}

/**
 * Fetches the current authentication session from the backend
 * @returns Promise with auth payload
 */
export async function getAuthSession(): Promise<AuthPayload> {
  try {
    // Always use relative URL for API request to ensure proxy works correctly
    const url = '/api/auth/session';
    console.log(`📡 Auth session fetch using URL: ${url}`);
    
    const data = await makeAuthApiRequest(url);
    
    if (!data) {
      return {
        session: null as any,
        user: null as any,
        org: null as any
      };
    }
    
    return data;
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
  // Check for throttling based on last attempt
  const now = Date.now();
  if (now - lastLoginAttempt < MIN_LOGIN_INTERVAL) {
    console.log(`📡 Login attempted too soon after previous attempt (${now - lastLoginAttempt}ms), throttling`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
  }
  
  lastLoginAttempt = now;
  console.log("📡 Signing in user:", email);
  
  try {
    // Use relative URL for API request
    const loginEndpoint = '/api/auth/login';
    
    const result = await makeAuthApiRequest(loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    return result || { success: true };
  } catch (error) {
    handleApiError(error, { context: 'signin', showToast: true });
    throw error;
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  console.log("📡 Signing out user");
  try {
    await makeAuthApiRequest('/api/auth/signout', {
      method: 'POST'
    });
    
    // Clear any local state
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
    await makeAuthApiRequest('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName })
    });
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
    await makeAuthApiRequest('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    // Show success toast
    toast({
      title: "Reset Email Sent",
      description: "Please check your email for password reset instructions."
    });
  } catch (error) {
    handleApiError(error, { context: 'password-reset', showToast: true });
    throw error;
  }
}

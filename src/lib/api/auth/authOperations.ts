
/**
 * Specific auth API operations (login, logout, etc)
 */

import { makeAuthRequest } from './authRequest';
import { handleAuthApiError } from './authApiUtils';
import { AuthApiOptions, AuthResponse } from './types';
import { AuthPayload } from '../../api/auth/types';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches the current authentication session from the backend
 */
export async function getAuthSession(): Promise<AuthPayload> {
  try {
    // Always use relative URL for API request to ensure proxy works correctly
    const url = '/api/auth/session';
    console.log(`📡 Auth session fetch using URL: ${url}`);
    
    const data = await makeAuthRequest(url);
    
    if (!data) {
      return {
        session: null as any,
        user: null as any,
        org: null as any
      };
    }
    
    return data;
  } catch (error) {
    handleAuthApiError(error, { context: 'auth-session' });
    throw error;
  }
}

/**
 * Signs in a user with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  console.log("📡 Signing in user:", email);
  
  try {
    // Use relative URL for API request
    const loginEndpoint = '/api/auth/login';
    
    const result = await makeAuthRequest(loginEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    return result || { success: true };
  } catch (error) {
    handleAuthApiError(error, { context: 'signin', showToast: true });
    throw error;
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  console.log("📡 Signing out user");
  try {
    await makeAuthRequest('/api/auth/signout', {
      method: 'POST'
    });
    
    // Clear any local state
    console.log("📡 Signed out successfully, clearing local state");
  } catch (error) {
    handleAuthApiError(error, { context: 'signout', showToast: true });
    throw error;
  }
}

/**
 * Signs up a new user
 */
export async function signUp(
  email: string, 
  password: string, 
  fullName: string
): Promise<void> {
  console.log("📡 Signing up new user:", email);
  try {
    await makeAuthRequest('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName })
    });
  } catch (error) {
    handleAuthApiError(error, { context: 'signup', showToast: true });
    throw error;
  }
}

/**
 * Sends a password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  console.log("📡 Requesting password reset for:", email);
  try {
    await makeAuthRequest('/api/auth/reset-password', {
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
    handleAuthApiError(error, { context: 'password-reset', showToast: true });
    throw error;
  }
}

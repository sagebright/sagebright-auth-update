import { getOrgFromUrl, redirectToOrgUrl, getOrgById } from '@/lib/subdomainUtils';
import { handleApiError } from '@/lib/handleApiError';
import { toast } from '@/hooks/use-toast';
import { makeAuthRequest } from '@/lib/api/auth/authRequest';

/**
 * Signs up a new user
 */
export async function signUp(
  email: string, 
  password: string, 
  fullName: string,
  onSuccess: () => void,
  onError: (error: any) => void
) {
  try {
    const response = await makeAuthRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        fullName,
      }),
    });

    if (!response) {
      throw new Error('Error signing up');
    }

    toast({
      title: "Account created successfully",
      description: "Please check your email for verification instructions.",
      variant: "default",
    });
    
    onSuccess();
  } catch (error: any) {
    handleApiError(error, { context: 'signup' });
    onError(error);
    throw error;
  }
}

/**
 * Signs in an existing user
 */
export async function signIn(
  email: string, 
  password: string,
  onError: (error: any) => void
) {
  try {
    const response = await makeAuthRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response) {
      throw new Error('Error signing in');
    }
    
    // Explicit logging for successful login
    console.log('🔑 Login successful, session established');
    
    toast({
      title: "Login successful",
      description: "Welcome back!",
      variant: "default",
    });
    
    // Check if redirection to organization is needed
    const currentOrgSlug = getOrgFromUrl();
    const userOrgSlug = response?.user?.user_metadata?.org_slug;
    
    if (userOrgSlug && currentOrgSlug !== userOrgSlug) {
      console.log('🔄 Redirecting to correct organization:', userOrgSlug);
      redirectToOrgUrl(userOrgSlug);
    }
    
    return response;
  } catch (error: any) {
    handleApiError(error, { context: 'login' });
    onError(error);
    throw error;
  }
}

/**
 * Signs in with Google
 */
export async function signInWithGoogle(onError: (error: any) => void) {
  try {
    // Redirect to Google OAuth flow
    window.location.href = '/api/auth/google';
  } catch (error: any) {
    handleApiError(error, { context: 'google-login' });
    onError(error);
    throw error;
  }
}

/**
 * Signs out the current user
 */
export async function signOut(onError: (error: any) => void) {
  try {
    // Store the current org slug before signing out
    const currentOrgSlug = getOrgFromUrl();
    
    const response = await makeAuthRequest('/api/auth/signout', {
      method: 'POST',
    });

    if (!response) {
      throw new Error('Error signing out');
    }
    
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out.",
      variant: "default",
    });
    
    // Clear any client-side storage
    localStorage.removeItem('sagebright_session');
    
    // Redirect to org-specific login page if on a subdomain
    if (currentOrgSlug) {
      window.location.href = window.location.protocol + '//' + 
        window.location.hostname + '/auth/login';
      return true;
    }
    
    // Otherwise redirect to main login page
    window.location.href = '/auth/login';
    return true;
  } catch (error: any) {
    handleApiError(error, { context: 'logout' });
    onError(error);
    throw error;
  }
}

/**
 * Sends a password reset link
 */
export async function resetPassword(email: string, onError: (error: any) => void) {
  try {
    const response = await makeAuthRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response) {
      throw new Error('Error resetting password');
    }
    
    toast({
      title: "Password reset email sent",
      description: "Please check your email for instructions to reset your password.",
      variant: "default",
    });
    
    return true;
  } catch (error: any) {
    handleApiError(error, { context: 'password-reset' });
    onError(error);
    throw error;
  }
}

/**
 * Updates the user profile
 */
export async function updateProfile(data: any) {
  try {
    const response = await makeAuthRequest('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response) {
      throw new Error('Error updating profile');
    }

    return response;
  } catch (error) {
    handleApiError(error, { context: 'profile-update' });
    throw error;
  }
}

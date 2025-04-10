import { supabase } from '@/lib/supabaseClient';
import { getOrgFromUrl, redirectToOrgUrl, getOrgById } from '@/lib/subdomainUtils';
import { syncUserRole } from '@/lib/syncUserRole';
import { syncExistingUsers } from '@/lib/syncExistingUsers';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/handleApiError';

export async function signUp(
  email: string, 
  password: string, 
  fullName: string,
  onSuccess: () => void,
  onError: (error: any) => void
) {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    
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

export async function signIn(
  email: string, 
  password: string,
  onError: (error: any) => void
) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Sync user role after successful login with explicit logging
    if (data?.user?.id) {
      console.log('🔑 Login successful, syncing user role for ID:', data.user.id);
      try {
        await syncUserRole(data.user.id);
        console.log('✅ User role synchronized after login');
        
        // Force refresh the session to get updated metadata
        try {
          await supabase.auth.refreshSession();
          console.log('✅ Session refreshed after role sync');
        } catch (refreshError) {
          console.error('⚠️ Session refresh failed:', refreshError);
        }
      } catch (syncError) {
        console.error('⚠️ Role sync failed but login succeeded:', syncError);
        // Continue with login flow even if role sync fails
      }
      
      // Also try to sync the user to the users table but don't let it block the flow
      try {
        await syncExistingUsers();
        console.log('✅ User synchronized to users table after login');
      } catch (userSyncError) {
        console.error('⚠️ User sync failed but login succeeded:', userSyncError);
        // Continue with login flow even if user sync fails
      }
    }
    
    toast({
      title: "Login successful",
      description: "Welcome back!",
      variant: "default",
    });
    
    return data;
  } catch (error: any) {
    handleApiError(error, { context: 'login' });
    onError(error);
    throw error;
  }
}

export async function signInWithGoogle(onError: (error: any) => void) {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) throw error;
  } catch (error: any) {
    handleApiError(error, { context: 'google-login' });
    onError(error);
    throw error;
  }
}

export async function signOut(onError: (error: any) => void) {
  try {
    // Store the current org slug before signing out
    const currentOrgSlug = getOrgFromUrl();
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out.",
      variant: "default",
    });
    
    // Redirect to org-specific login page if on a subdomain
    if (currentOrgSlug) {
      window.location.href = window.location.protocol + '//' + 
        window.location.hostname + '/auth/login';
      return;
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

export async function resetPassword(email: string, onError: (error: any) => void) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) throw error;
    
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

export async function updateProfile(data: any) {
  console.warn("🔧 TODO: Replace with PATCH /api/users/:id");
  // Will replace Supabase update with backend route later
}

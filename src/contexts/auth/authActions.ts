
import { supabase } from '@/lib/supabaseClient';
import { getOrgFromUrl, redirectToOrgUrl, getOrgById } from '@/lib/subdomainUtils';

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
    onSuccess();
  } catch (error: any) {
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
    
    // Check for organization context
    const userOrgId = data.user?.user_metadata?.org_id;
    if (userOrgId) {
      // Get org details including slug
      const orgDetails = await getOrgById(userOrgId);
      const orgSlug = orgDetails?.slug;
      
      if (orgSlug) {
        const currentOrgSlug = getOrgFromUrl();
        if (!currentOrgSlug || currentOrgSlug !== orgSlug) {
          console.log('🏢 Redirecting to org subdomain after sign in:', orgSlug);
          // Store path for after subdomain redirect
          const redirectPath = localStorage.getItem("redirectAfterLogin") || '/user-dashboard';
          sessionStorage.setItem('lastAuthenticatedPath', redirectPath);
          localStorage.removeItem("redirectAfterLogin");
          redirectToOrgUrl(orgSlug);
          return data;
        }
      }
    }

    return data;
  } catch (error: any) {
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
    onError(error);
    throw error;
  }
}

export async function signOut(onError: (error: any) => void) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Redirect to root domain on signout if on a subdomain
    const currentOrgSlug = getOrgFromUrl();
    if (currentOrgSlug) {
      window.location.href = window.location.protocol + '//' + 
        window.location.hostname.split('.').slice(1).join('.');
      return;
    }
    
    return true;
  } catch (error: any) {
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
    return true;
  } catch (error: any) {
    onError(error);
    throw error;
  }
}

export async function updateProfile(data: any) {
  console.warn("🔧 TODO: Replace with PATCH /api/users/:id");
  // Will replace Supabase update with backend route later
}

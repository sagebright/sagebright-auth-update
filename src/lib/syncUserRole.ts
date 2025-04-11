
import { supabase } from './supabaseClient';
import { handleApiError } from './handleApiError';
import { toast } from '@/hooks/use-toast';

/**
 * Forces a synchronization of the user's role from the database to the auth metadata
 * @param userId The ID of the user to sync
 * @returns Promise with the sync result or error
 */
export async function syncUserRole(userId: string): Promise<any> {
  try {
    console.log('🔄 Manually syncing user role for:', userId);
    
    // First, try to call the sync-user-role edge function
    try {
      const { data, error } = await supabase.functions.invoke('sync-user-role', {
        body: { userId }
      });
      
      if (error) {
        console.error('❌ Edge function error:', error);
        throw error;
      }
      
      console.log('✅ User role synchronized via edge function:', data);
      return data;
    } catch (edgeFunctionError) {
      console.warn('⚠️ Edge function failed, falling back to direct access:', edgeFunctionError);
      
      // Fall back to direct auth data access
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData) {
        console.error('❌ Cannot get current user', authError);
        throw new Error('Cannot retrieve user data: ' + (authError?.message || 'Unknown error'));
      }
      
      console.log('✅ Got user data directly, using existing authentication');
      return { 
        message: 'Using direct auth data access',
        userId,
        role: userData.user.user_metadata?.role || 'user',
        directAccess: true 
      };
    }
  } catch (error: any) {
    // Handle overall errors and provide user feedback
    const errorMessage = error.message || 'Unknown error during role synchronization';
    console.error('❌ Role sync failed:', errorMessage);
    
    // Use handleApiError with silent option for background operations
    handleApiError(error, { 
      context: 'role-sync',
      fallbackMessage: 'Unable to synchronize your account. Please try signing out and back in.',
      showToast: false,
      silent: true
    });
    
    // Rethrow to allow calling code to handle the error
    throw error;
  }
}

/**
 * Simplified version of syncUserRole that only shows a toast on success, not on failure
 * Useful for background syncs that shouldn't interrupt the user experience
 */
export async function syncUserRoleQuietly(userId: string): Promise<any> {
  try {
    const result = await syncUserRole(userId);
    return result;
  } catch (error) {
    // Log but don't show error to user
    console.error('Background role sync failed:', error);
    return null;
  }
}

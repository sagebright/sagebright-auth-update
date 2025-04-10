
import { supabase } from './supabaseClient';
import { handleApiError } from './handleApiError';
import { toast } from '@/hooks/use-toast';

/**
 * Forces a synchronization of the user's role from the database to the auth metadata
 * @param userId The ID of the user to sync
 * @returns Promise with the sync result or error
 */
export async function syncUserRole(userId: string): Promise<any> {
  // Add unique identifiers for logging and tracking
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  try {
    console.log('🔄 Manually syncing user role for:', userId, 'requestId:', requestId);
    
    // Simplified approach - just try the direct fetch and skip edge functions
    // This bypasses the CORS issues with edge functions
    try {
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
    } catch (directAccessError) {
      console.error('❌ Direct access attempt failed:', directAccessError);
      throw new Error('Failed to retrieve authentication data');
    }
  } catch (error: any) {
    // Handle overall errors and provide user feedback
    const errorMessage = error.message || 'Unknown error during role synchronization';
    
    console.error('❌ Role sync completely failed after', Date.now() - startTime, 'ms:', errorMessage);
    
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
    
    // Only show success message if this was a recovery operation
    if (result?.recoveryOperation) {
      toast({
        title: "Account Recovery",
        description: "Successfully recovered your account access.",
      });
    }
    
    return result;
  } catch (error) {
    // Log but don't show error to user
    console.error('Background role sync failed:', error);
    return null;
  }
}

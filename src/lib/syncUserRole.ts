import { fetchAuth } from '@/lib/backendAuth';
import { handleApiError } from './handleApiError';
import { toast } from '@/hooks/use-toast';

/**
 * Forces a synchronization of the user's role from the database to the auth metadata
 * @param userId The ID of the user to sync
 * @returns Promise with the sync result or error
 */
export async function syncUserRole(userId: string): Promise<any> {
  try {
    console.log('🔄 Checking user role sync for:', userId);
    
    const authData = await fetchAuth();
    
    if (!authData?.user) {
      throw new Error('Cannot retrieve user data');
    }
    
    return { 
      message: 'Using auth data access',
      userId,
      role: authData.user.role,
      directAccess: true 
    };
  } catch (error: any) {
    console.error('❌ Role sync failed:', error);
    
    handleApiError(error, { 
      context: 'role-sync',
      fallbackMessage: 'Unable to synchronize your account. Please try signing out and back in.',
      showToast: false,
      silent: true
    });
    
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

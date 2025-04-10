
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
    
    // First attempt: Try the primary edge function
    try {
      const { data, error } = await supabase.functions.invoke('sync-user-role', {
        body: { userId },
        headers: { 
          'x-manual-sync': 'true',
          'x-request-id': requestId
        }
      });
      
      if (error) throw error;
      
      console.log('✅ Manual role sync successful:', data, 'in', Date.now() - startTime, 'ms');
      return data;
    } catch (primaryError: any) {
      console.error('❌ Primary sync failed:', primaryError.message || primaryError);
      
      // Second attempt: Try the auto-sync edge function as fallback
      try {
        console.log('🔄 Attempting fallback to auto-sync-user-role');
        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('auto-sync-user-role', {
          body: { userId },
          headers: { 
            'x-fallback-sync': 'true',
            'x-request-id': requestId
          }
        });
        
        if (fallbackError) throw fallbackError;
        
        console.log('✅ Fallback sync succeeded:', fallbackData);
        return fallbackData;
      } catch (fallbackCallError: any) {
        console.error('❌ Fallback sync also failed:', fallbackCallError.message || fallbackCallError);
        
        // Third attempt: Try database-triggers as last resort
        try {
          console.log('🔄 Attempting last resort with database-triggers');
          const { data: triggerData, error: triggerError } = await supabase.functions.invoke('database-triggers', {
            body: { userId, action: 'sync-user' },
            headers: { 
              'x-last-resort': 'true',
              'x-request-id': requestId
            }
          });
          
          if (triggerError) throw triggerError;
          
          console.log('✅ Last resort sync succeeded:', triggerData);
          return triggerData;
        } catch (triggerError: any) {
          console.error('❌ All edge function attempts failed');
          
          // Final attempt: Get user data directly as a read-only operation
          try {
            console.log('🔄 Attempting to get user data directly');
            const { data: userData, error: authError } = await supabase.auth.getUser();
            
            if (authError || !userData) {
              console.error('❌ Cannot get current user', authError);
              throw new Error('Cannot retrieve user data: ' + (authError?.message || 'Unknown error'));
            }
            
            console.log('✅ Got user data directly, role recovery incomplete but authentication persists');
            return { 
              message: 'Could not sync with edge functions, but retrieved user data',
              userId,
              role: userData.user.user_metadata?.role || 'user',
              partialSuccess: true 
            };
          } catch (directFallbackError) {
            console.error('❌ All recovery attempts failed:', directFallbackError);
            throw new Error('All role sync methods failed');
          }
        }
      }
    }
  } catch (error: any) {
    // Handle overall errors and provide user feedback
    const errorMessage = error.message || 'Unknown error during role synchronization';
    
    console.error('❌ Role sync completely failed after', Date.now() - startTime, 'ms:', errorMessage);
    
    // Use handleApiError with silent option to avoid showing technical errors to users
    handleApiError(error, { 
      context: 'role-sync',
      fallbackMessage: 'Unable to synchronize your account. Please try signing out and back in.',
      showToast: true,
      variant: 'destructive',
      silent: false
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


import { supabase } from './supabaseClient';

/**
 * Forces a synchronization of the user's role from the database to the auth metadata
 * @param userId The ID of the user to sync
 * @returns Promise with the sync result or error
 */
export async function syncUserRole(userId: string): Promise<any> {
  try {
    console.log('🔄 Manually syncing user role for:', userId);
    
    // Add a unique identifier to avoid duplicate calls
    const requestId = crypto.randomUUID();
    
    // Call the new sync-user-role edge function with proper error handling
    const { data, error } = await supabase.functions.invoke('sync-user-role', {
      body: { userId },
      // Add more explicit logging for debugging
      headers: { 
        'x-manual-sync': 'true',
        'x-request-id': requestId
      }
    });
    
    if (error) {
      console.error('❌ Error syncing user role:', error);
      throw error;
    }
    
    // Log the successful response
    console.log('✅ Manual role sync result:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to sync user role:', error);
    
    // Try falling back to auto-sync-user-role if the main function fails
    try {
      console.log('🔄 Attempting fallback to auto-sync-user-role');
      const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('auto-sync-user-role', {
        body: { userId },
        headers: { 
          'x-fallback-sync': 'true',
          'x-request-id': crypto.randomUUID()
        }
      });
      
      if (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        throw fallbackError;
      }
      
      console.log('✅ Fallback sync succeeded:', fallbackData);
      return fallbackData;
    } catch (fallbackCallError) {
      console.error('❌ All sync attempts failed:', fallbackCallError);
      
      // Final fallback to get user data directly
      try {
        console.log('🔄 Attempting to get user data directly');
        const { data: userData, error: authError } = await supabase.auth.getUser();
        
        if (authError || !userData) {
          console.error('❌ Cannot get current user', authError);
          throw error; // Re-throw the original error
        }
        
        console.log('✅ Got user data directly');
        return { message: 'Could not sync with edge function, but got user data', userId };
      } catch (directFallbackError) {
        console.error('❌ All recovery attempts failed:', directFallbackError);
        throw error; // Re-throw the original error
      }
    }
  }
}

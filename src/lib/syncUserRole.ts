
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
    
    // Set the correct edge function URL using the project ID
    const SUPABASE_PROJECT_ID = 'uonxhnmvrtuszgjubvaa';
    
    // Call the auto-sync-user-role edge function with proper error handling
    const { data, error } = await supabase.functions.invoke('auto-sync-user-role', {
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
    
    // Add fallback for user role assignment directly
    try {
      console.log('🔄 Attempting to get user data directly');
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !userData) {
        console.error('❌ Cannot get current user', authError);
        throw error; // Re-throw the original error
      }
      
      console.log('✅ Got user data directly');
      return { message: 'Could not sync with edge function, but got user data', userId };
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      throw error; // Re-throw the original error
    }
  }
}


import { supabase } from './supabaseClient';

/**
 * Forces a synchronization of the user's role from the database to the auth metadata
 * @param userId The ID of the user to sync
 * @returns Promise with the sync result or error
 */
export async function syncUserRole(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('auto-sync-user-role', {
      body: { userId }
    });
    
    if (error) {
      console.error('Error syncing user role:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to sync user role:', error);
    throw error;
  }
}


import { supabase } from './supabaseClient';

/**
 * Manually synchronizes existing auth users to the users table
 * This can be called from the app code when needed
 */
export async function syncExistingUsers(): Promise<string[]> {
  try {
    console.log('🔄 Manually syncing existing users to users table');
    
    const { data, error } = await supabase.rpc('sync_existing_users');
    
    if (error) {
      console.error('❌ Error syncing existing users:', error);
      throw error;
    }
    
    console.log('✅ Sync completed:', data);
    return data as string[];
  } catch (error) {
    console.error('❌ Failed to sync existing users:', error);
    throw error;
  }
}

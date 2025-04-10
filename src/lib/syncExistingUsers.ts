
import { supabase } from './supabaseClient';

/**
 * Manually synchronizes existing auth users to the users table
 * This can be called from the app code when needed
 */
export async function syncExistingUsers(): Promise<string[]> {
  try {
    console.log('🔄 Manually syncing existing users to users table');
    
    // Use direct function invocation for more reliability
    const { data, error } = await supabase.functions.invoke('database-triggers', {
      body: {}
    });
    
    if (error) {
      console.error('❌ Error calling database-triggers function:', error);
      throw error;
    }
    
    console.log('✅ Successfully called database-triggers:', data);
    return ['Called database-triggers function successfully'];
  } catch (error) {
    console.error('❌ Trigger function failed:', error);
    console.log('ℹ️ This is not a critical error if the user can still use the application');
    // Don't throw the error - we want login to continue
    return ['User creation attempt completed, but sync may not have succeeded'];
  }
}

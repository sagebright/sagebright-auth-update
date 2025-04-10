
import { supabase } from './supabaseClient';

/**
 * Manually synchronizes existing auth users to the users table
 * This can be called from the app code when needed
 */
export async function syncExistingUsers(): Promise<string[]> {
  try {
    console.log('🔄 Manually syncing existing users to users table');
    
    // Call the database-triggers edge function directly
    // This is the approach that's working based on logs
    const { data: triggerData, error: triggerError } = await supabase.functions.invoke('database-triggers', {
      body: {}
    });
    
    if (triggerError) {
      console.error('❌ Error calling database-triggers function:', triggerError);
      throw triggerError;
    }
    
    console.log('✅ Successfully called database-triggers:', triggerData);
    return ['Called database-triggers function successfully'];
  } catch (error) {
    console.error('❌ Trigger function failed:', error);
    console.log('ℹ️ This is not a critical error if the user can still use the application');
    return ['User creation attempt completed, but sync may not have succeeded'];
  }
}

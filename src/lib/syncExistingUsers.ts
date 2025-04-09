
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
    
    // Try a direct insertion as a fallback
    try {
      console.log('🔄 Attempting direct user insertion as fallback');
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        throw new Error('No authenticated user found');
      }
      
      const user = sessionData.session.user;
      
      // Check if the user already exists in the users table
      const { data: existingUserData } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (existingUserData) {
        console.log('✅ User already exists in users table:', user.id);
        return [`User ${user.id} already exists`];
      }
      
      // Insert the user if they don't exist
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
          role: user.user_metadata?.role || 'user'
        });
        
      if (insertError) {
        console.error('❌ Error inserting user:', insertError);
        throw insertError;
      }
      
      console.log('✅ Successfully inserted user directly:', user.id);
      return [`Created user ${user.id} directly`];
    } catch (fallbackError) {
      console.error('❌ Fallback user insertion also failed:', fallbackError);
      throw error || fallbackError;
    }
  }
}

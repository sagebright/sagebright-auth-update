
import { supabase } from './supabaseClient';

/**
 * Manually synchronizes existing auth users to the users table
 * This can be called from the app code when needed
 */
export async function syncExistingUsers(): Promise<string[]> {
  try {
    console.log('🔄 Manually syncing existing users to users table');
    
    // First, try to call the RPC function
    const { data, error } = await supabase.rpc('sync_existing_users');
    
    if (error) {
      console.error('❌ Error syncing existing users:', error);
      throw error;
    }
    
    console.log('✅ Sync completed:', data);
    return data as string[];
  } catch (error) {
    console.error('❌ Failed to sync existing users:', error);
    
    // Try using the database-triggers edge function as an alternative
    try {
      console.log('🔄 Attempting to call database-triggers function');
      const { data: triggerData, error: triggerError } = await supabase.functions.invoke('database-triggers', {
        body: {}
      });
      
      if (triggerError) {
        console.error('❌ Error calling database-triggers function:', triggerError);
        throw triggerError;
      }
      
      console.log('✅ Successfully called database-triggers:', triggerData);
      return ['Called database-triggers function successfully'];
    } catch (triggerError) {
      console.error('❌ Trigger function also failed:', triggerError);
      
      // Second fallback: direct insertion
      try {
        console.log('🔄 Attempting direct user insertion as fallback');
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session?.user) {
          throw new Error('No authenticated user found');
        }
        
        const user = sessionData.session.user;
        
        // Check if the user already exists in the users table using direct Supabase query
        // instead of going through the backend API which is failing with permissions
        const { data: existingUserData, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (checkError) {
          // Don't treat this as a critical error, the user might not exist yet
          console.log('⚠️ Could not check if user exists:', checkError);
        }
          
        if (existingUserData) {
          console.log('✅ User already exists in users table:', user.id);
          return [`User ${user.id} already exists`];
        }
        
        // Insert the user if they don't exist, using direct Supabase query
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
        console.log('ℹ️ This is not a critical error if the user can still use the application');
        return ['User creation failed, but authentication was successful'];
      }
    }
  }
}

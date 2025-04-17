
// src/lib/fetchUserContext.ts

import { supabase } from '@/lib/supabaseClient';

/**
 * Fetches user-level context for a given user ID.
 * Enhanced with better error handling and debugging.
 *
 * @param userId - Supabase user ID
 * @returns User context object or null if not found
 */
export async function fetchUserContext(userId: string) {
  console.log("📡 fetchUserContext triggered", { userId });
  
  if (!userId) {
    console.warn("⚠️ Cannot fetch user context: No userId provided");
    return null;
  }

  // Log the attempt with specific ID for debugging
  console.log(`[fetchUserContext] Attempting to fetch context for userId: ${userId}`);

  try {
    // Make sure we're querying the right table with the right field
    const { data, error } = await supabase
      .from('user_context')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching user_context:', error.message, error.details, error.hint);
      return null;
    }

    if (!data) {
      console.warn(`⚠️ No user_context found for userId: ${userId}`);
      return null;
    }

    console.log(`✅ Successfully retrieved user context for userId: ${userId}`, {
      hasContextId: !!data.id,
      dataFieldCount: Object.keys(data).length
    });
    
    return data;
  } catch (err) {
    console.error('❌ Exception in fetchUserContext:', err);
    return null;
  }
}


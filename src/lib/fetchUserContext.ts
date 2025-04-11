
// src/lib/fetchUserContext.ts

import { supabase } from '@/lib/supabaseClient';

/**
 * Fetches user-level context for a given user ID.
 *
 * @param userId - Supabase user ID
 * @returns User context object or null if not found
 */
export async function fetchUserContext(userId: string) {
  if (!userId) {
    console.warn("⚠️ Cannot fetch user context: No userId provided");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_context')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('⚠️ Error fetching user_context:', error.message);
      return null;
    }

    if (!data) {
      console.warn(`⚠️ No user_context found for userId: ${userId}. This is expected during development.`);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ Exception in fetchUserContext:', err);
    return null;
  }
}

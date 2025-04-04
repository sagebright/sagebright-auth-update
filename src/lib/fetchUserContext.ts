// src/lib/fetchUserContext.ts

import { supabase } from '@/lib/supabaseClient';

/**
 * Fetches user-level context for a given user ID.
 *
 * @param userId - Supabase user ID
 * @returns User context object or null if not found
 */
export async function fetchUserContext(userId: string) {
  const { data, error } = await supabase
    .from('user_context')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('🔴 Error fetching user context:', error.message);
    return null;
  }

  return data;
}

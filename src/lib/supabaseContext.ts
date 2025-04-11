
import { supabase } from './supabaseClient'

export async function insertOrgContext(data: any) {
  const { data: result, error } = await supabase
    .from('org_context')
    .insert([data])

  if (error) throw error
  return result
}

export async function getOrgContext(orgId: string) {
  if (!orgId) {
    console.warn("⚠️ Cannot fetch org context: No orgId provided");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('org_context')
      .select('*')
      .eq('org_id', orgId)
      .maybeSingle()

    if (error) {
      console.warn('⚠️ Error fetching org_context:', error.message);
      return null;
    }

    if (!data) {
      console.warn(`⚠️ No org_context found for orgId: ${orgId}. This is expected during development.`);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ Exception in getOrgContext:', err);
    return null;
  }
}

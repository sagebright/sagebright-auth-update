
import { supabase } from './supabaseClient'

export async function insertOrgContext(data: any) {
  const { data: result, error } = await supabase
    .from('org_context')
    .insert([data])

  if (error) throw error
  return result
}

export async function getOrgContext(orgId: string) {
  const { data, error } = await supabase
    .from('org_context')
    .select('*')
    .eq('org_id', orgId)
    .single()

  if (error) throw error
  return data
}

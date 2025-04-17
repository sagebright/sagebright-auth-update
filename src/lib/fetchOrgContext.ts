
// src/lib/fetchOrgContext.ts

import { supabase } from '@/lib/supabaseClient';

/**
 * Fetches organizational context from the org_context table.
 * Enhanced with better error handling and detailed logging.
 *
 * @param orgId - The organization ID tied to the user/session
 * @returns Object containing org-level configuration for Sage, or null if not found
 */
export async function fetchOrgContext(orgId: string) {
  console.log("📡 fetchOrgContext triggered", { orgId });
  
  if (!orgId) {
    console.warn("⚠️ Cannot fetch org context: No orgId provided");
    return null;
  }

  console.log(`[fetchOrgContext] Attempting to fetch context for orgId: ${orgId}`);
  
  try {
    // Explicitly query the org_context table with the exact primary key field
    const { data, error } = await supabase
      .from('org_context')
      .select('*')
      .eq('id', orgId)  // Ensure we're using the right field for the lookup
      .maybeSingle();

    if (error) {
      console.error('❌ Error fetching org_context:', error.message, error.details, error.hint);
      return null;
    }

    if (!data) {
      // Try alternative lookup by org_id field if id field didn't work
      console.log(`⚠️ No org_context found with id=${orgId}, trying org_id field instead`);
      
      const { data: altData, error: altError } = await supabase
        .from('org_context')
        .select('*')
        .eq('org_id', orgId)
        .maybeSingle();
        
      if (altError) {
        console.error('❌ Error in alternative org_context lookup:', altError.message);
        return null;
      }
      
      if (!altData) {
        console.warn(`⚠️ No org_context found for either id or org_id=${orgId}`);
        return null;
      }
      
      console.log(`✅ Successfully found org context via org_id field for: ${orgId}`);
      return altData;
    }

    console.log(`✅ Successfully found org context data for orgId: ${orgId}`, {
      hasName: !!data.name,
      dataKeys: Object.keys(data)
    });
    
    return data;
  } catch (err) {
    console.error('❌ Exception in fetchOrgContext:', err);
    return null;
  }
}


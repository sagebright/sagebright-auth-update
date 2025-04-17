
import { fetchAuth } from '@/lib/backendAuth';

/**
 * Fetches organizational context from the backend auth endpoint.
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
    const authData = await fetchAuth();
    
    if (!authData || !authData.org) {
      console.warn(`⚠️ No org context found for orgId=${orgId}`);
      return null;
    }
    
    // Format the data to match the original schema
    const orgData = {
      id: authData.org.id,
      org_id: authData.org.id, // Keep compatibility with existing code
      slug: authData.org.slug,
    };

    console.log(`✅ Successfully found org context data for orgId: ${orgId}`, {
      hasName: !!orgData.slug,
      dataKeys: Object.keys(orgData)
    });
    
    return orgData;
  } catch (err) {
    console.error('❌ Exception in fetchOrgContext:', err);
    return null;
  }
}

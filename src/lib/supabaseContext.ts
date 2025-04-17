
import { fetchAuth } from '@/lib/backendAuth';

export async function insertOrgContext(data: any) {
  throw new Error('insertOrgContext is deprecated - use backend APIs instead');
}

export async function getOrgContext(orgId: string) {
  if (!orgId) {
    console.warn("⚠️ Cannot fetch org context: No orgId provided");
    return null;
  }
  
  try {
    const authData = await fetchAuth();
    
    if (authData?.org?.id === orgId) {
      return {
        org_id: authData.org.id,
        slug: authData.org.slug
      };
    }

    return null;
  } catch (err) {
    console.warn('⚠️ Exception in getOrgContext:', err);
    return null;
  }
}

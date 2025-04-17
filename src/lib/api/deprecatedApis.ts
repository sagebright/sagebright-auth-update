
/**
 * Deprecated API functions
 * These are kept for backward compatibility but should be replaced
 * with the new unified context API.
 */
import { apiRequest } from './coreApiClient';
import { fetchUserContext } from '../fetchUserContext';
import { fetchOrgContext } from '../fetchOrgContext';

/**
 * @deprecated Use buildSageContext instead for context hydration
 */
export async function fetchContextData(userId: string, orgId: string, orgSlug: string | null = null, options = {}) {
  console.warn('⚠️ fetchContextData is deprecated. Use buildSageContext instead.');
  
  try {
    console.log(`🔄 Fetching context data for userId:${userId}, orgId:${orgId}`);
    
    const response = await fetch(`/api/context?userId=${userId}&orgId=${orgId}${orgSlug ? `&orgSlug=${orgSlug}` : ''}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      ...options
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Non-JSON response received from context API:', contentType);
      throw new Error(`Expected JSON response, got ${contentType}`);
    }
    
    if (!response.ok) {
      console.error(`❌ Error fetching context: ${response.status} ${response.statusText}`);
      return { ok: false, data: null, error: `HTTP error ${response.status}` };
    }
    
    const data = await response.json();
    return { ok: true, data, error: null };
  } catch (error) {
    console.error('❌ Exception in fetchContextData:', error);
    return { ok: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * @deprecated Do not use this function directly. Context should be hydrated through buildSageContext.
 * This function is kept only for backward compatibility.
 */
export async function getUserContext(userId: string) {
  console.warn('⚠️ Legacy getUserContext called directly. Use buildSageContext instead.');
  
  // Try direct Supabase fetch first - this is more reliable
  try {
    console.log(`🔍 Directly fetching user context for userId: ${userId}`);
    const userData = await fetchUserContext(userId);
    
    if (userData) {
      console.log('✅ Direct user context fetch successful');
      return userData;
    }
  } catch (error) {
    console.error('❌ Direct user context fetch error:', error);
  }
  
  // Try API as fallback - explicitly mark as a potentially invalid route
  const apiResult = await apiRequest(`/user/context?userId=${userId}`, {}, {
    context: 'fetching user context',
    fallbackMessage: 'Unable to load user context. Using local data if available.',
    silent: true,
    mockEvenIn404: true,
    validateRoute: false // Skip route validation as we know this is deprecated
  });
  
  return apiResult?.data || null;
}

/**
 * @deprecated Do not use this function directly. Context should be hydrated through buildSageContext.
 * This function is kept only for backward compatibility.
 */
export async function getOrgContext(orgId: string) {
  console.warn('⚠️ Legacy getOrgContext called directly. Use buildSageContext instead.');
  
  // Try direct Supabase fetch first - this is more reliable
  try {
    console.log(`🔍 Directly fetching org context for orgId: ${orgId}`);
    const orgData = await fetchOrgContext(orgId);
    
    if (orgData) {
      console.log('✅ Direct org context fetch successful');
      return orgData;
    }
  } catch (error) {
    console.error('❌ Direct org context fetch error:', error);
  }
  
  // Try API as fallback - explicitly mark as a potentially invalid route
  const apiResult = await apiRequest(`/org/context?orgId=${orgId}`, {}, {
    context: 'fetching org context',
    fallbackMessage: 'Unable to load organization context. Using local data if available.',
    silent: true,
    mockEvenIn404: true,
    validateRoute: false // Skip route validation as we know this is deprecated
  });
  
  return apiResult?.data || null;
}

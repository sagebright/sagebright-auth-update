
import { apiRequest } from './apiClient';

/**
 * Fetches the complete Sage context from the unified endpoint
 * This is the recommended approach for getting context data
 */
export async function fetchSageContext(userId: string, orgId: string, options = {}) {
  const res = await apiRequest(`/api/context/sage?userId=${userId}&orgId=${orgId}`, {}, {
    context: 'fetching Sage context',
    fallbackMessage: 'Unable to load Sage context. Using development data.',
    ...options
  });
  
  return res?.data || null;
}

/**
 * Gets only the user portion of the Sage context
 */
export async function fetchSageUserContext(userId: string, options = {}) {
  const context = await fetchSageContext(userId, '', options);
  return context?.user || null;
}

/**
 * Gets only the organization portion of the Sage context
 */
export async function fetchSageOrgContext(orgId: string, options = {}) {
  const context = await fetchSageContext('', orgId, options);
  return context?.org || null;
}

/**
 * Function to hydrate all context data in a single request
 * This should be the primary way to get context going forward
 */
export async function hydrateSageContext(userId: string, orgId: string) {
  console.log('🔄 Hydrating Sage context with unified endpoint');
  
  try {
    const context = await fetchSageContext(userId, orgId);
    
    if (!context) {
      console.error('❌ Failed to hydrate Sage context');
      return null;
    }
    
    console.log('✅ Successfully hydrated Sage context');
    return {
      user: context.user,
      org: context.org,
      meta: context.meta || { source: 'api', timestamp: new Date().toISOString() }
    };
  } catch (error) {
    console.error('❌ Error hydrating Sage context:', error);
    return null;
  }
}

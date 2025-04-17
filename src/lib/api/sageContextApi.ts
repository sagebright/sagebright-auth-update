
import { apiRequest } from './coreApiClient';
import { validateSageContext } from '../validation/contextSchema';

/**
 * Standardized endpoint for fetching the complete Sage context
 * This is the recommended approach for getting context data
 */
export async function fetchSageContext(userId: string, orgId: string, orgSlug: string | null = null, options = {}) {
  // Construct the API endpoint with proper query parameters
  const endpoint = `/api/context/sage?userId=${encodeURIComponent(userId)}&orgId=${encodeURIComponent(orgId)}${
    orgSlug ? `&orgSlug=${encodeURIComponent(orgSlug)}` : ''
  }`;
  
  const res = await apiRequest(endpoint, {}, {
    context: 'fetching Sage context',
    fallbackMessage: 'Unable to load Sage context. Using development data.',
    ...options
  });
  
  // Validate the returned context if we have data
  if (res?.data) {
    try {
      validateSageContext(res.data);
      console.log('✅ Sage context validation passed');
    } catch (error) {
      console.warn('⚠️ Sage context validation failed:', error);
    }
  }
  
  return res?.data || null;
}

/**
 * Gets only the user portion of the Sage context
 */
export async function fetchSageUserContext(userId: string, options = {}) {
  if (!userId) {
    console.error('❌ fetchSageUserContext called with empty userId');
    return null;
  }
  
  const context = await fetchSageContext(userId, '', null, options);
  return context?.user || null;
}

/**
 * Gets only the organization portion of the Sage context
 */
export async function fetchSageOrgContext(orgId: string, options = {}) {
  if (!orgId) {
    console.error('❌ fetchSageOrgContext called with empty orgId');
    return null;
  }
  
  const context = await fetchSageContext('', orgId, null, options);
  return context?.org || null;
}

/**
 * Function to hydrate all context data in a single request
 * This should be the primary way to get context going forward
 */
export async function hydrateSageContext(userId: string, orgId: string, orgSlug: string | null = null) {
  console.log('🔄 Hydrating Sage context with unified endpoint');
  
  try {
    if (!userId || !orgId) {
      console.error('❌ hydrateSageContext called with missing required parameters');
      return null;
    }
    
    const context = await fetchSageContext(userId, orgId, orgSlug);
    
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

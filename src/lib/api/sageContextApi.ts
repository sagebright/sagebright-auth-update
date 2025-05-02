
import { apiRequest } from './coreApiClient';
import { validateSageContext } from '../validation/contextSchema';
import { SageContext } from '@/types/chat';

/**
 * Standardized endpoint for fetching the complete Sage context
 * This is the recommended approach for getting context data
 */
export async function fetchSageContext(userId: string, orgId: string, orgSlug: string | null = null, options = {}) {
  console.log("📡 fetchSageContext API call", { userId, orgId, orgSlug });
  
  // Construct the API endpoint with proper query parameters
  const endpoint = `/api/context/sage?userId=${encodeURIComponent(userId)}&orgId=${encodeURIComponent(orgId)}${
    orgSlug ? `&orgSlug=${encodeURIComponent(orgSlug)}` : ''
  }`;
  
  console.log(`🛠️ backendApi route reached: ${endpoint}`);
  
  try {
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
  } catch (error) {
    console.error('❌ Error in fetchSageContext:', error);
    throw error;
  }
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
export async function hydrateSageContext(userId: string, orgId: string, orgSlug: string | null = null, timeout: number = 5000): Promise<SageContext | null> {
  console.log('🔄 hydrateSageContext called', { userId, orgId, orgSlug, timeout });
  
  // Create a promise that rejects after the timeout
  const timeoutPromise = new Promise<null>((_, reject) => {
    setTimeout(() => reject(new Error(`Context hydration timed out after ${timeout}ms`)), timeout);
  });
  
  try {
    if (!userId || !orgId) {
      console.error('❌ hydrateSageContext called with missing required parameters');
      return null;
    }
    
    // Race between the actual fetch and the timeout
    const context = await Promise.race([
      fetchSageContext(userId, orgId, orgSlug),
      timeoutPromise
    ]);
    
    if (!context) {
      console.error('❌ Failed to hydrate Sage context');
      return null;
    }
    
    console.log('✅ Successfully hydrated Sage context');
    return {
      user: context.user,
      org: context.org,
      userId,
      orgId,
      messages: [],
      _meta: context._meta || { 
        source: 'api', 
        hydratedAt: new Date().toISOString(),
        timeout: false
      }
    } as SageContext;
  } catch (error) {
    console.error('❌ Error hydrating Sage context:', error);
    
    // If it was a timeout error, return a minimal context with a timeout flag
    if (error instanceof Error && error.message.includes('timed out')) {
      console.warn('⏱️ Context hydration timed out, using fallback');
      return {
        user: null,
        org: null,
        userId,
        orgId,
        messages: [],
        _meta: {
          source: 'timeout-fallback',
          hydratedAt: new Date().toISOString(),
          timeout: true,
          error: 'Hydration timed out'
        }
      } as SageContext;
    }
    
    throw error; // Re-throw other errors to be handled by the caller
  }
}

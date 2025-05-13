
import { apiRequest } from './coreApiClient';
import { validateSageContext } from '../validation/contextSchema';
import { SageContext } from '@/types/chat';
import { API_BASE_URL } from '../constants';

/**
 * Standardized endpoint for fetching the complete Sage context
 * This is the recommended approach for getting context data
 */
export async function fetchSageContext(userId: string, orgId: string, orgSlug: string | null = null, options = {}) {
  console.log("📡 fetchSageContext API call", { userId, orgId, orgSlug });
  
  // Construct the API endpoint with proper query parameters and absolute URL
  const endpoint = `${API_BASE_URL}/api/context/sage?userId=${encodeURIComponent(userId)}&orgId=${encodeURIComponent(orgId)}${
    orgSlug ? `&orgSlug=${encodeURIComponent(orgSlug)}` : ''
  }`;
  
  console.log(`🛠️ Making direct backend API request to: ${endpoint}`);
  
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: 'include' as RequestCredentials,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      mode: 'cors' as RequestMode
    };
    
    const response = await fetch(endpoint, fetchOptions);
    
    // Handle 404 errors gracefully - provide fallback context
    if (response.status === 404) {
      console.warn(`⚠️ Context endpoint not found (404): ${endpoint}`);
      return {
        user: { id: userId, _fallback: true },
        org: { id: orgId, slug: orgSlug || 'default', _fallback: true },
        _meta: {
          source: 'fallback-404',
          hydratedAt: new Date().toISOString(),
          error: 'Context API endpoint not found (404)'
        }
      };
    }
    
    if (!response.ok) {
      throw new Error(`Context API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate the returned context if we have data
    if (data) {
      try {
        validateSageContext(data);
        console.log('✅ Sage context validation passed');
      } catch (error) {
        console.warn('⚠️ Sage context validation failed:', error);
      }
    }
    
    return data || null;
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
 * Enhanced with better 404 handling and fallbacks
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
      return {
        user: { id: userId || 'unknown', _fallback: true },
        org: { id: orgId || 'unknown', slug: orgSlug || 'default', _fallback: true },
        userId: userId || 'unknown',
        orgId: orgId || 'unknown',
        messages: [],
        _meta: {
          source: 'fallback-missing-params',
          hydratedAt: new Date().toISOString(),
          error: 'Missing required parameters'
        }
      } as SageContext;
    }
    
    // Race between the actual fetch and the timeout
    try {
      const context = await Promise.race([
        fetchSageContext(userId, orgId, orgSlug),
        timeoutPromise
      ]);
      
      if (!context) {
        console.error('❌ Failed to hydrate Sage context');
        return createFallbackContext(userId, orgId, orgSlug, 'api-null-response');
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
    } catch (fetchError) {
      console.warn('⚠️ Error fetching context, using fallback:', fetchError);
      return createFallbackContext(userId, orgId, orgSlug, 'fetch-error');
    }
  } catch (error) {
    console.error('❌ Error hydrating Sage context:', error);
    
    // If it was a timeout error, return a minimal context with a timeout flag
    if (error instanceof Error && error.message.includes('timed out')) {
      console.warn('⏱️ Context hydration timed out, using fallback');
      return createFallbackContext(userId, orgId, orgSlug, 'timeout');
    }
    
    return createFallbackContext(userId, orgId, orgSlug, 'unknown-error');
  }
}

/**
 * Helper to create a consistent fallback context
 */
function createFallbackContext(userId: string, orgId: string, orgSlug: string | null, reason: string): SageContext {
  return {
    user: { 
      id: userId, 
      _fallback: true,
      displayName: 'User'
    },
    org: { 
      id: orgId, 
      slug: orgSlug || 'default',
      _fallback: true,
      name: 'Organization'
    },
    userId,
    orgId,
    messages: [],
    _meta: {
      source: `fallback-${reason}`,
      hydratedAt: new Date().toISOString(),
      timeout: reason === 'timeout',
      error: `Context creation failed: ${reason}`
    }
  } as SageContext;
}

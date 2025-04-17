
// Re-export all API functions
export * from './api/apiClient';
export * from './api/usersApi';
export * from './api/departmentsApi';
export * from './api/roadmapsApi';
export * from './api/sageContextApi';

import { apiRequest } from './api/apiClient';
import { fetchUserContext } from './fetchUserContext';
import { fetchOrgContext } from './fetchOrgContext';
import { buildSageContext } from './context/buildSageContext';

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

/**
 * Creates a new API endpoint to fetch the unified Sage context
 * This is the preferred method for getting context in one request
 */
export async function fetchSageContext(userId: string, orgId: string, orgSlug: string | null = null) {
  return await apiRequest(`/api/context/sage?userId=${userId}&orgId=${orgId}${orgSlug ? `&orgSlug=${orgSlug}` : ''}`, {}, {
    context: 'fetching sage context',
    fallbackMessage: 'Unable to load context for Sage. Using local data if available.',
    silent: true,
    useMockInDev: true
  });
}

// Export generic data mutation creator
export function createMutation(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  errorContext: string,
  fallbackMessage: string
) {
  return async (data?: any) => {
    const { apiRequest } = await import('./api/apiClient');
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const res = await apiRequest(path, options, {
      context: errorContext,
      fallbackMessage
    });
    return res?.data;
  };
}

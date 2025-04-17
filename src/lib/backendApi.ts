
// Re-export all API functions
export * from './api/apiClient';
export * from './api/usersApi';
export * from './api/departmentsApi';
export * from './api/roadmapsApi';

import { apiRequest } from './api/apiClient';
import { supabase } from './supabaseClient';
import { fetchUserContext } from './fetchUserContext';
import { fetchOrgContext } from './fetchOrgContext';

/**
 * Get user context from the API
 * @deprecated Do not use this function directly. Context should be hydrated through buildSageContext.
 */
export async function getUserContext(userId: string) {
  console.log('⚠️ Legacy getUserContext called directly. This function is deprecated.');
  
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
  
  // Try API as fallback
  const apiResult = await apiRequest(`/user/context?userId=${userId}`, {}, {
    context: 'fetching user context',
    fallbackMessage: 'Unable to load user context. Using local data if available.',
    silent: true,
    mockEvenIn404: true
  });
  
  // If API fails, use a fallback for development
  if ((!apiResult.ok || !apiResult.data) && process.env.NODE_ENV === 'development') {
    console.log('⚠️ API fetch failed for user context, providing development fallback');
    
    return {
      id: 'dev-fallback-user-context',
      user_id: userId,
      name: "Development User",
      role: "user",
      department: "Development",
      manager_name: "Dev Manager",
      learning_style: "Visual",
      timezone: "UTC-8",
      source: 'api-fallback'
    };
  }
  
  return apiResult?.data || null;
}

/**
 * Get organization context from the API
 * @deprecated Do not use this function directly. Context should be hydrated through buildSageContext.
 */
export async function getOrgContext(orgId: string) {
  console.log('⚠️ Legacy getOrgContext called directly. This function is deprecated.');
  
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
  
  // Try API as fallback
  const apiResult = await apiRequest(`/org/context?orgId=${orgId}`, {}, {
    context: 'fetching org context',
    fallbackMessage: 'Unable to load organization context. Using local data if available.',
    silent: true,
    mockEvenIn404: true
  });
  
  // If API fails, use a fallback for development
  if ((!apiResult.ok || !apiResult.data) && process.env.NODE_ENV === 'development') {
    console.log('⚠️ API fetch failed for org context, providing development fallback');
    
    return {
      id: orgId,
      orgId: orgId,
      name: "Development Organization",
      mission: "This is a development environment",
      values: ["Resilience", "Testing", "Development"],
      tools_and_systems: "Development toolkit",
      executives: [{ name: "Dev Lead", role: "CTO" }],
      source: 'api-fallback'
    };
  }
  
  return apiResult?.data || null;
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

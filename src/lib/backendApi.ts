
// Re-export all API functions
export * from './api/apiClient';
export * from './api/usersApi';
export * from './api/departmentsApi';
export * from './api/roadmapsApi';

import { apiRequest } from './api/apiClient';
import { supabase } from './supabaseClient';

/**
 * Get user context from the API
 * @deprecated Do not use this function directly. Context should be hydrated through buildSageContext.
 */
export async function getUserContext(userId: string) {
  console.log('⚠️ Legacy getUserContext called directly. This function is deprecated.');
  
  // Try API first
  const apiResult = await apiRequest(`/user/context?userId=${userId}`, {}, {
    context: 'fetching user context',
    fallbackMessage: 'Unable to load user context. Using local data if available.',
    silent: true,
    mockEvenIn404: true
  });
  
  // If API fails and in development, try direct Supabase query as fallback
  if ((!apiResult.ok || !apiResult.data) && process.env.NODE_ENV === 'development') {
    console.log('⚠️ API fetch failed for user context, trying direct Supabase query');
    
    try {
      const { data, error } = await supabase
        .from('user_context')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Supabase fetch for user context failed:', error);
      // Return mock data in development to prevent blocking
      if (process.env.NODE_ENV === 'development') {
        return {
          id: 'dev-fallback-user-context',
          user_id: userId,
          name: "Development User",
          role: "user"
        };
      }
      return null;
    }
  }
  
  return apiResult?.data || null;
}

/**
 * Get organization context from the API
 * @deprecated Do not use this function directly. Context should be hydrated through buildSageContext.
 */
export async function getOrgContext(orgId: string) {
  console.log('⚠️ Legacy getOrgContext called directly. This function is deprecated.');
  
  // Try API first
  const apiResult = await apiRequest(`/org/context?orgId=${orgId}`, {}, {
    context: 'fetching org context',
    fallbackMessage: 'Unable to load organization context. Using local data if available.',
    silent: true,
    mockEvenIn404: true
  });
  
  // If API fails and in development, try direct Supabase query as fallback
  if ((!apiResult.ok || !apiResult.data) && process.env.NODE_ENV === 'development') {
    console.log('⚠️ API fetch failed for org context, trying direct Supabase query');
    
    try {
      const { data, error } = await supabase
        .from('org_context')
        .select('*')
        .eq('id', orgId)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Supabase fetch for org context failed:', error);
      // Return mock data in development to prevent blocking
      if (process.env.NODE_ENV === 'development') {
        return {
          id: orgId,
          orgId: orgId,
          name: "Development Organization",
          mission: "This is a development environment"
        };
      }
      return null;
    }
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

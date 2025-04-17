
// Re-export all API functions
export * from './api/apiClient';
export * from './api/usersApi';
export * from './api/departmentsApi';
export * from './api/roadmapsApi';
export * from './api/sageContextApi';

import { apiRequest } from './api/coreApiClient';

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
    const { apiRequest } = await import('./api/coreApiClient');
    
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

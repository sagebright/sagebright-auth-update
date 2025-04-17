
// Re-export all API functions
export * from './api/apiClient';
export * from './api/usersApi';
export * from './api/departmentsApi';
export * from './api/roadmapsApi';
export * from './api/sageContextApi';

// Log backend API access
console.log("🛠️ backendApi module loaded");

// Export generic data mutation creator for reusability
export function createMutation(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  errorContext: string,
  fallbackMessage: string
) {
  return async (data?: any) => {
    console.log(`🛠️ backendApi route reached: ${path} with method ${method}`);
    
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


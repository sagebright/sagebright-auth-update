
/**
 * Base API client for making requests to the backend
 */

import { toast } from '@/components/ui/use-toast';

interface ApiRequestOptions {
  context?: string;
  fallbackMessage?: string;
  silent?: boolean;
}

/**
 * Makes an API request with error handling and toast notifications
 */
export async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}, 
  config: ApiRequestOptions = {}
) {
  const { context = 'API request', fallbackMessage = 'An error occurred', silent = false } = config;
  
  try {
    console.log(`🔄 Making API request to ${endpoint}`);
    
    // Check if we're in development mode and need to use mock data
    if (process.env.NODE_ENV === 'development' && endpoint === '/users') {
      console.log('🧪 Using mock data for /users endpoint in development');
      return {
        ok: true,
        status: 200,
        data: [
          { id: '1', name: 'Development User', email: 'dev@example.com', role: 'admin' },
          { id: '2', name: 'Test User', email: 'test@example.com', role: 'user' }
        ]
      };
    }
    
    // Make the actual API request for non-mocked endpoints
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const url = `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { ok: true, status: response.status, data };
    
  } catch (error) {
    console.error(`❌ Error in ${context}:`, error);
    
    if (!silent) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: fallbackMessage,
      });
    }
    
    return { ok: false, error };
  }
}

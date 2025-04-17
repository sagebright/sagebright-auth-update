
/**
 * Base API client for making requests to the backend
 */

import { toast } from '@/components/ui/use-toast';

interface ApiRequestOptions {
  context?: string;
  fallbackMessage?: string;
  silent?: boolean;
  useMockInDev?: boolean;
  mockEvenIn404?: boolean; // New option to mock responses even for 404s
}

/**
 * Makes an API request with error handling and toast notifications
 */
export async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}, 
  config: ApiRequestOptions = {}
) {
  const { 
    context = 'API request', 
    fallbackMessage = 'An error occurred', 
    silent = false,
    useMockInDev = true,
    mockEvenIn404 = false
  } = config;
  
  try {
    console.log(`🔄 Making API request to ${endpoint}`);
    
    // Check if we're in development mode and need to use mock data
    if (process.env.NODE_ENV === 'development' && useMockInDev) {
      console.log(`🧪 Using mock data for ${endpoint} endpoint in development`);
      
      // Return appropriate mock data based on endpoint
      if (endpoint === '/users') {
        return {
          ok: true,
          status: 200,
          data: [
            { id: '1', name: 'Development User', email: 'dev@example.com', role: 'admin' },
          ]
        };
      }
      
      if (endpoint.includes('/user/context')) {
        return {
          ok: true,
          status: 200,
          data: {
            id: 'mock-user-context-id',
            user_id: endpoint.includes('userId=') ? endpoint.split('userId=')[1].split('&')[0] : '1',
            org_id: '1',
            role: 'user',
            department: 'Engineering',
            manager_name: 'Dev Manager',
            learning_style: 'Visual',
            timezone: 'UTC-8',
            start_date: '2023-01-01'
          }
        };
      }
      
      if (endpoint.includes('/org/context')) {
        return {
          ok: true,
          status: 200,
          data: {
            id: 'mock-org-context-id',
            orgId: endpoint.includes('orgId=') ? endpoint.split('orgId=')[1].split('&')[0] : '1',
            name: "Development Organization",
            mission: "This is a development environment",
            values: ["Learning", "Testing", "Developing"],
            tools_and_systems: "Development toolkit",
            executives: [{ name: "Dev Lead", role: "CTO" }]
          }
        };
      }
    }
    
    // Make the actual API request for non-mocked endpoints
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const url = `${baseUrl}${endpoint}`;
    
    console.log(`📤 Sending request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    // Check content type to handle non-JSON responses
    const contentType = response.headers.get('content-type');
    
    // If we got a 404 and mockEvenIn404 is true, we'll mock the response in development
    if (!response.ok && response.status === 404 && process.env.NODE_ENV === 'development' && mockEvenIn404) {
      console.log(`⚠️ 404 for ${endpoint} but mockEvenIn404 is enabled. Returning mock data.`);
      
      if (endpoint.includes('/user/context')) {
        return {
          ok: true,
          status: 200,
          data: {
            id: 'mock-user-context-404-fallback',
            user_id: endpoint.includes('userId=') ? endpoint.split('userId=')[1].split('&')[0] : '1',
            role: 'user',
            department: 'Engineering (Mock 404)',
            learning_style: 'Visual',
            timezone: 'UTC-8',
          }
        };
      }
      
      if (endpoint.includes('/org/context')) {
        return {
          ok: true,
          status: 200,
          data: {
            id: 'mock-org-context-404-fallback',
            orgId: endpoint.includes('orgId=') ? endpoint.split('orgId=')[1].split('&')[0] : '1',
            name: "Development Organization (Mock 404)",
            mission: "This is a development environment",
            values: ["Learning", "Testing"]
          }
        };
      }
    }

    // Check if response is OK and handle non-JSON responses
    if (!response.ok) {
      console.error(`❌ API error ${response.status}: ${response.statusText} for ${endpoint}`);
      
      // Check if we got HTML instead of JSON (typical for server errors)
      if (contentType && contentType.includes('text/html')) {
        console.error('Received HTML error page instead of JSON response');
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    // Handle non-JSON responses gracefully
    if (contentType && !contentType.includes('application/json')) {
      console.warn(`⚠️ Non-JSON response received: ${contentType}`);
      
      const textResponse = await response.text();
      console.log('Text response preview:', textResponse.substring(0, 100));
      
      return { 
        ok: true, 
        status: response.status, 
        data: { 
          message: 'Non-JSON response',
          contentType,
          textPreview: textResponse.substring(0, 100)
        }
      };
    }

    const data = await response.json();
    console.log(`✅ API request to ${endpoint} successful:`, { status: response.status });
    return { ok: true, status: response.status, data };
    
  } catch (error) {
    console.error(`❌ Error in ${context}:`, error);
    
    // In development, provide more detailed fallback for context-related endpoints
    if (process.env.NODE_ENV === 'development' && useMockInDev) {
      if (endpoint.includes('/context')) {
        console.log('🧪 Using fallback mock data after API error');
        return { 
          ok: true, 
          status: 200, 
          data: { 
            id: 'fallback-id',
            name: 'Fallback Data',
            message: 'This is fallback data after an API error',
            error: error instanceof Error ? error.message : 'Unknown error'
          } 
        };
      }
    }
    
    if (!silent) {
      toast({
        variant: 'destructive',
        title: 'API Error',
        description: fallbackMessage,
      });
    }
    
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: error
    };
  }
}

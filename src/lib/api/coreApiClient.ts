
/**
 * Core API client functionality
 */
import { toast } from '@/components/ui/use-toast';
import { ApiRequestOptions, ApiResponse } from './types';
import { isValidApiRoute } from './routeValidation';
import { getMockResponseForEndpoint } from './mockDataProvider';

/**
 * Makes an API request with error handling, route validation and toast notifications
 */
export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}, 
  config: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { 
    context = 'API request', 
    fallbackMessage = 'An error occurred', 
    silent = false,
    useMockInDev = true,
    mockEvenIn404 = false,
    validateRoute = true
  } = config;
  
  try {
    console.log(`🔄 Making API request to ${endpoint}`);
    
    // Route validation to prevent calls to non-existent endpoints
    if (validateRoute && process.env.NODE_ENV !== 'test') {
      if (!isValidApiRoute(endpoint)) {
        console.warn(`⚠️ WARNING: Request to potentially invalid API route: ${endpoint}`);
        
        // In development, proceed with mocking instead of failing
        if (process.env.NODE_ENV === 'development') {
          console.log(`🧪 Using mock data for potentially invalid route: ${endpoint}`);
          return getMockResponseForEndpoint(endpoint);
        }
      }
    }
    
    // Check if we're in development mode and need to use mock data
    if (process.env.NODE_ENV === 'development' && useMockInDev) {
      return getMockResponseForEndpoint(endpoint);
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
      return getMockResponseForEndpoint(endpoint);
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
        } as unknown as T
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
        return getMockResponseForEndpoint(endpoint);
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

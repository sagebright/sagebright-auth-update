
/**
 * Core API client for making requests with improved validation and error handling
 */
import { ApiRequestOptions, ApiResponse } from './types';
import { isValidApiRoute } from './routeValidation';

/**
 * Makes a request to the API with enhanced error handling and validation
 */
export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}, 
  requestOptions: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    context = 'API request',
    fallbackMessage = 'An error occurred. Please try again.',
    silent = false,
    useMockInDev = false,
    mockEvenIn404 = false,
    validateRoute = true
  } = requestOptions;

  try {
    // Optional route validation to catch invalid API paths early
    if (validateRoute && !isValidApiRoute(endpoint)) {
      console.warn(`⚠️ Potentially invalid API route: ${endpoint}`);
      
      // In production, this should be a hard error unless explicitly bypassed
      if (process.env.NODE_ENV === 'production' && !requestOptions.validateRoute === false) {
        throw new Error(`Invalid API route: ${endpoint}`);
      }
    }

    // Use mock data in development if configured
    if (process.env.NODE_ENV === 'development' && useMockInDev) {
      console.log(`🧪 Using mock data for endpoint: ${endpoint}`);
      
      const { getMockResponseForEndpoint } = await import('./mockDataProvider');
      const mockResponse = getMockResponseForEndpoint(endpoint);
      
      return mockResponse as ApiResponse<T>;
    }

    // Make the actual API request
    console.log(`🔄 API request: ${endpoint}`);
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Handle 404s with mock data if configured
    if (!response.ok && response.status === 404 && process.env.NODE_ENV === 'development' && mockEvenIn404) {
      console.warn(`⚠️ 404 for ${endpoint}, using mock data`);
      const { getMockResponseForEndpoint } = await import('./mockDataProvider');
      const mockResponse = getMockResponseForEndpoint(endpoint);
      return mockResponse as ApiResponse<T>;
    }

    // Process the response
    if (!response.ok) {
      console.error(`❌ API error (${context}): ${response.status} ${response.statusText}`);
      
      let errorMessage = fallbackMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || fallbackMessage;
      } catch (e) {
        // If we can't parse JSON, just use the fallback message
      }

      return {
        ok: false,
        status: response.status,
        error: errorMessage,
        errorDetails: { status: response.status, statusText: response.statusText }
      };
    }

    // Parse the successful response
    const data = await response.json();
    return { 
      ok: true, 
      status: response.status,
      data 
    };
  } catch (error) {
    // Handle unexpected errors
    console.error(`❌ Exception in ${context}:`, error);
    
    if (!silent) {
      // Here we would typically show a toast notification
      // but we'll leave that to the caller
    }

    return { 
      ok: false, 
      error: error instanceof Error ? error.message : fallbackMessage,
      errorDetails: error
    };
  }
}

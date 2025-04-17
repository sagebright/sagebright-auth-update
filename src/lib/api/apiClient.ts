
/**
 * Base API client for making requests to the backend
 * with improved route validation and safety
 */

import { toast } from '@/components/ui/use-toast';

// Define a registry of valid API routes for validation
const VALID_API_ROUTES = [
  '/api/context/sage',
  '/api/context',
  '/api/chat',
  '/api/ask-sage',
  // Add other valid routes here
];

interface ApiRequestOptions {
  context?: string;
  fallbackMessage?: string;
  silent?: boolean;
  useMockInDev?: boolean;
  mockEvenIn404?: boolean;
  validateRoute?: boolean; // New option to validate routes
}

/**
 * Validates if a requested endpoint exists in our API registry
 */
function isValidApiRoute(endpoint: string): boolean {
  // Consider paths with query params valid if the base path is valid
  const basePath = endpoint.split('?')[0];
  
  // Also consider dynamically generated paths with IDs valid if the pattern exists
  const dynamicPathPattern = basePath.replace(/\/[a-zA-Z0-9-_]+$/, '/:id');
  
  return VALID_API_ROUTES.some(route => 
    basePath === route || 
    dynamicPathPattern === route || 
    route.includes('*')
  );
}

/**
 * Makes an API request with error handling, route validation and toast notifications
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

/**
 * Returns appropriate mock data based on endpoint
 * Centralizes all mock responses for better maintenance
 */
function getMockResponseForEndpoint(endpoint: string) {
  console.log(`🧪 Providing mock data for ${endpoint}`);
  
  // User context endpoints
  if (endpoint.includes('/user/context')) {
    const userId = endpoint.includes('userId=') ? endpoint.split('userId=')[1].split('&')[0] : 'mock-user-id';
    
    return {
      ok: true,
      status: 200,
      data: {
        id: 'mock-user-context-id',
        user_id: userId,
        org_id: 'mock-org-id',
        role: 'user',
        department: 'Engineering',
        manager_name: 'Dev Manager',
        learning_style: 'Visual',
        timezone: 'UTC-8',
        start_date: '2023-01-01',
        source: 'api-mock'
      }
    };
  }
  
  // Org context endpoints
  if (endpoint.includes('/org/context')) {
    const orgId = endpoint.includes('orgId=') ? endpoint.split('orgId=')[1].split('&')[0] : 'mock-org-id';
    
    return {
      ok: true,
      status: 200,
      data: {
        id: 'mock-org-context-id',
        orgId: orgId,
        name: "Development Organization",
        mission: "This is a development environment",
        values: ["Learning", "Testing", "Developing"],
        tools_and_systems: "Development toolkit",
        executives: [{ name: "Dev Lead", role: "CTO" }],
        source: 'api-mock'
      }
    };
  }
  
  // Unified context endpoint (new)
  if (endpoint.includes('/api/context/sage')) {
    return {
      ok: true,
      status: 200,
      data: {
        user: {
          id: 'mock-user-context-id',
          user_id: 'mock-user-id',
          role: 'user',
          department: 'Engineering',
          learning_style: 'Visual',
          source: 'api-mock'
        },
        org: {
          id: 'mock-org-context-id',
          name: "Development Organization",
          mission: "This is a development environment",
          values: ["Learning", "Testing", "Developing"],
          source: 'api-mock'
        }
      }
    };
  }
  
  // Users list endpoint (deprecated)
  if (endpoint === '/users') {
    console.warn('⚠️ Deprecated route /users accessed. Use /api/context/sage instead.');
    return {
      ok: true,
      status: 200,
      data: [
        { 
          id: 'mock-user-1', 
          name: 'Development User', 
          email: 'dev@example.com', 
          role: 'admin',
          source: 'deprecated-mock'
        },
      ]
    };
  }
  
  // Departments endpoint (deprecated)
  if (endpoint === '/departments') {
    console.warn('⚠️ Deprecated route /departments accessed.');
    return {
      ok: true,
      status: 200,
      data: [
        { id: 'dept-1', name: 'Engineering' },
        { id: 'dept-2', name: 'Sales' },
        { id: 'dept-3', name: 'Marketing' }
      ]
    };
  }
  
  // Roadmaps endpoint (deprecated)
  if (endpoint === '/roadmaps') {
    console.warn('⚠️ Deprecated route /roadmaps accessed.');
    return {
      ok: true,
      status: 200,
      data: [
        { id: 'rm-1', name: 'Q2 Development Plan', progress: 65 },
        { id: 'rm-2', name: 'Annual Strategy', progress: 30 }
      ]
    };
  }
  
  // Fallback for any other endpoint
  return {
    ok: true,
    status: 200,
    data: {
      message: 'Mock data for development',
      endpoint,
      warning: 'This endpoint may not exist in production',
      source: 'generic-mock'
    }
  };
}

/**
 * Enhanced API client for handling context-specific requests
 * with better error handling and HTML response detection
 * @deprecated Use buildSageContext instead for context hydration
 */
export async function fetchContextData(userId: string, orgId: string, orgSlug: string | null = null, options = {}) {
  console.warn('⚠️ fetchContextData is deprecated. Use buildSageContext instead.');
  
  try {
    console.log(`🔄 Fetching context data for userId:${userId}, orgId:${orgId}`);
    
    const response = await fetch(`/api/context?userId=${userId}&orgId=${orgId}${orgSlug ? `&orgSlug=${orgSlug}` : ''}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      ...options
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Non-JSON response received from context API:', contentType);
      throw new Error(`Expected JSON response, got ${contentType}`);
    }
    
    if (!response.ok) {
      console.error(`❌ Error fetching context: ${response.status} ${response.statusText}`);
      return { ok: false, data: null, error: `HTTP error ${response.status}` };
    }
    
    const data = await response.json();
    return { ok: true, data, error: null };
  } catch (error) {
    console.error('❌ Exception in fetchContextData:', error);
    return { ok: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

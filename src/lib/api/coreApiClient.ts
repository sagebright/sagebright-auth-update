
/**
 * Core API client functionality for making backend requests
 */
import { API_BASE_URL } from '../constants';

interface ApiRequestOptions {
  context?: string;
  fallbackMessage?: string;
  timeout?: number;
  abortSignal?: AbortSignal;
}

/**
 * Makes an API request with proper error handling and timeout
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  requestOptions: ApiRequestOptions = {}
) {
  const { timeout = 10000 } = requestOptions;
  
  // Ensure endpoint is properly formatted
  const fixedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Always use the absolute URL with API_BASE_URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${fixedEndpoint}`;
  
  console.log(`🌐 API request to ${url}`);
  
  // Set up abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Merge the abort signal with any provided signal
  const signal = requestOptions.abortSignal 
    ? AbortSignal.any([controller.signal, requestOptions.abortSignal]) 
    : controller.signal;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      credentials: 'include' as RequestCredentials,
      mode: 'cors' as RequestMode,
      signal
    });
    
    clearTimeout(timeoutId);
    
    // Handle non-OK responses
    if (!response.ok) {
      console.error(`API error (${response.status}): ${url}`);
      return { error: `${response.status} ${response.statusText}`, status: response.status };
    }
    
    // Parse JSON response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { data, status: response.status };
    } else {
      console.warn(`API response not JSON: ${contentType}`);
      return { 
        error: 'Invalid response format',
        status: response.status,
        contentType
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error(`API request timed out after ${timeout}ms: ${url}`);
      return { error: 'Request timed out', status: 408 };
    }
    
    console.error('API request error:', error);
    return { error: error.message, status: 0 };
  }
}

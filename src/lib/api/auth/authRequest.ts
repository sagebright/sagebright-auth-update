
/**
 * Core auth request functionality
 */

import { 
  processAuthResponse, 
  preventDuplicateRequests, 
  markRequestCompleted,
  DEFAULT_TIMEOUT
} from './authApiUtils';
import { AuthApiOptions } from './types';

/**
 * Makes an authenticated API request with error handling
 */
export async function makeAuthRequest(
  url: string, 
  options: RequestInit = {}, 
  apiOptions: AuthApiOptions = {}
) {
  const endpoint = url.split('/').pop() || url;
  const { timeout = DEFAULT_TIMEOUT } = apiOptions;
  
  // Prevent duplicate or throttled calls
  if (preventDuplicateRequests(endpoint)) {
    return null;
  }
  
  console.log(`📡 Making auth API request to: ${url}`);
  
  try {
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      },
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    console.log(`📡 ${endpoint} response:`, { 
      status: response.status,
      ok: response.ok
    });

    return processAuthResponse(response, endpoint);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`📡 ${endpoint} request timed out after ${timeout}ms`);
      throw new Error(`Request timed out. Please try again.`);
    }
    throw error;
  } finally {
    markRequestCompleted(endpoint);
  }
}

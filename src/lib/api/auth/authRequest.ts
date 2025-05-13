
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
import { API_BASE_URL } from '../../constants';

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
  
  // Convert relative URLs to absolute URLs using the API_BASE_URL constant
  const absoluteUrl = url.startsWith('http') 
    ? url // Already absolute
    : `${API_BASE_URL}${url}`; // Trust the caller's path
  
  console.log(`📡 Making auth API request to: ${absoluteUrl}`);
  
  try {
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(absoluteUrl, {
      credentials: 'include', // Always include credentials for auth requests
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      },
      mode: 'cors', // Explicitly set CORS mode for cross-origin requests
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
    // Handle CORS errors specifically
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error(`📡 CORS error detected when accessing: ${absoluteUrl}`);
      console.error("This is likely because the backend doesn't have CORS headers enabled for this origin.");
      
      throw new Error(`CORS policy blocked access to ${endpoint}. The backend needs to allow this origin.`);
    }
    
    if (error.name === 'AbortError') {
      console.error(`📡 ${endpoint} request timed out after ${timeout}ms`);
      throw new Error(`Request timed out. Please try again.`);
    }
    throw error;
  } finally {
    markRequestCompleted(endpoint);
  }
}

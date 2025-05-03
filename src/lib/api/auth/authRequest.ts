
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

// Define the base URL for all backend API requests
const API_BASE_URL = 'https://sagebright-backend.up.railway.app';

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
  
  // Convert relative URLs to absolute URLs
  const absoluteUrl = url.startsWith('/api') 
    ? `${API_BASE_URL}${url.substring(4)}` // Remove '/api' prefix and add backend URL
    : url.startsWith('http') 
      ? url // Already absolute
      : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`; // Add leading slash if needed
  
  console.log(`📡 Making auth API request to: ${absoluteUrl}`);
  
  try {
    // Set up request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(absoluteUrl, {
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

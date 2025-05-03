
/**
 * Utilities for making authenticated fetch requests
 */

import { processAuthResponse } from './responseUtils';
import { hasAuthCookie } from '../cookies/cookieDetection';
import { createEmptyAuthPayload } from './emptyStateUtils';

// Define the base URL for all backend API requests
const API_BASE_URL = 'https://sagebright-backend.up.railway.app';

/**
 * Make an authenticated API request with proper error handling
 */
export async function makeAuthFetch(url: string, options: RequestInit = {}): Promise<any> {
  // Convert relative URLs to absolute URLs
  const absoluteUrl = url.startsWith('/api') 
    ? `${API_BASE_URL}${url.substring(4)}` // Remove '/api' prefix and add backend URL
    : url.startsWith('http') 
      ? url // Already absolute
      : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`; // Add leading slash if needed
  
  console.log(`🔍 Making auth fetch to absolute URL: ${absoluteUrl}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const res = await fetch(absoluteUrl, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    try {
      return await processAuthResponse(res);
    } catch (responseError) {
      // If we get HTML instead of JSON on a successful login/auth response,
      // return a fallback success object since this is likely a misconfigured API
      if (res.ok && responseError.message && 
          responseError.message.includes('Expected JSON response')) {
        console.warn('🔄 API returned HTML but status was successful. Using fallback response.');
        
        // If this is specifically the session endpoint
        if (url.includes('/session')) {
          console.warn('🔄 Returning empty auth payload as fallback for session endpoint');
          return createEmptyAuthPayload(true);
        }
        
        return {
          success: true,
          fallback: true,
          warning: "API returned HTML instead of JSON"
        };
      }
      
      // Re-throw if not a content type issue
      throw responseError;
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.error("❌ Auth fetch request timed out after 10 seconds");
      throw new Error("Auth request timed out. Please try again.");
    }
    throw error;
  }
}

/**
 * Determine if authentication fetch should be skipped
 */
export function shouldSkipAuthFetch(forceCheck: boolean): boolean {
  const hasCookie = hasAuthCookie();

  if (!forceCheck && !hasCookie) {
    // Only log about missing cookie if forced
    if (forceCheck) {
      console.warn("🔄 No auth cookie detected, skipping session fetch");
    }
    return true;
  }
  
  return false;
}

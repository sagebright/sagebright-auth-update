/**
 * Utilities for making authenticated fetch requests
 */

import { processAuthResponse } from './responseUtils';
import { hasAuthCookie } from '../cookies/cookieDetection';
import { createEmptyAuthPayload } from './emptyStateUtils';

// Define the base URL for all backend API requests
const API_BASE_URL = 'https://sagebright-backend.onrender.com';

/**
 * Make an authenticated API request with proper error handling
 */
export async function makeAuthFetch(url: string, options: RequestInit = {}): Promise<any> {
  // Convert relative URLs to absolute URLs without modifying paths
  const absoluteUrl = url.startsWith('http') 
    ? url // Already absolute
    : `${API_BASE_URL}${url}`; // Trust the caller's path
  
  console.log(`🔍 Making auth fetch to absolute URL: ${absoluteUrl}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    // Set up request with CORS handling
    const res = await fetch(absoluteUrl, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      mode: 'cors', // Explicitly request CORS mode
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
    clearTimeout(timeoutId);
    
    // Handle CORS errors specifically
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error("❌ CORS error detected when accessing:", absoluteUrl);
      console.error("This is likely because the backend doesn't have CORS headers enabled for this origin.");
      
      // For session endpoints, return an empty payload rather than failing
      if (url.includes('/session')) {
        console.warn("🔄 CORS error on session endpoint, returning empty auth payload");
        return createEmptyAuthPayload(false);
      }
      
      // Throw a more informative error
      throw new Error("CORS policy blocked access to the backend API. The backend needs to allow this origin.");
    }
    
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

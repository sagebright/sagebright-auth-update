/**
 * Shared utilities for auth API operations
 */

import { handleApiError } from '../../handleApiError';
import { activeAuthRequests } from './types';

// Constants
export const MIN_REQUEST_INTERVAL = 2000; // 2 seconds
export const DEFAULT_TIMEOUT = 15000; // 15 seconds

/**
 * Processes API responses with error handling
 */
export async function processAuthResponse(response: Response, context: string) {
  console.log(`📡 Processing auth response for ${context}:`, {
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get('content-type')
  });
  
  if (!response.ok) {
    let errorMessage = `Error with ${context}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const text = await response.text();
        console.error(`${context} error text:`, text.substring(0, 200));
      }
    } catch (e) {
      console.error(`Could not parse ${context} error response:`, e);
    }
    throw new Error(errorMessage);
  }
  
  // Check for JSON responses
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    // Non-JSON success response (HTML fallback issue)
    console.warn(`⚠️ HTML fallback detected for ${context}. This indicates a proxy configuration issue.`);
    console.warn(`Content type: ${response.headers.get('content-type')}`);
    
    // Get a sample of the response to help debug
    try {
      const text = await response.text();
      console.warn('Response sample (first 200 chars):', text.substring(0, 200));
    } catch (err) {
      console.error('Could not sample response text:', err);
    }
    
    // Return a fallback object to prevent the app from crashing
    return { 
      success: true, 
      fallback: true,
      warning: "API proxy issue: HTML returned instead of JSON"
    };
  } catch (jsonError) {
    console.error(`📡 Failed to parse ${context} response:`, jsonError);
    // If we can't parse as JSON but the request was successful, return a simple success object
    return { 
      success: true,
      fallback: true,
      warning: "Failed to parse JSON response"
    };
  }
}

/**
 * Prevents duplicate requests to the same endpoint
 */
export function preventDuplicateRequests(endpoint: string): boolean {
  const requestKey = endpoint.split('/').pop() || endpoint;
  
  if (!activeAuthRequests[requestKey]) {
    activeAuthRequests[requestKey] = {
      inProgress: false,
      lastAttempt: 0
    };
  }
  
  // Check if request is already in progress
  if (activeAuthRequests[requestKey].inProgress) {
    console.log(`📡 ${requestKey} request already in progress, skipping duplicate`);
    return true;
  }
  
  // Check for request throttling
  const now = Date.now();
  const timeSinceLastAttempt = now - activeAuthRequests[requestKey].lastAttempt;
  
  if (timeSinceLastAttempt < MIN_REQUEST_INTERVAL) {
    console.log(`📡 ${requestKey} requested too soon (${timeSinceLastAttempt}ms), throttling`);
    return true;
  }
  
  // Update request state
  activeAuthRequests[requestKey].inProgress = true;
  activeAuthRequests[requestKey].lastAttempt = now;
  return false;
}

/**
 * Marks a request as completed
 */
export function markRequestCompleted(endpoint: string): void {
  const requestKey = endpoint.split('/').pop() || endpoint;
  if (activeAuthRequests[requestKey]) {
    activeAuthRequests[requestKey].inProgress = false;
  }
}

/**
 * Handles API errors with consistent logging and UI feedback
 */
export function handleAuthApiError(error: unknown, options: {
  context?: string;
  showToast?: boolean;
}) {
  handleApiError(error, {
    context: options.context || 'auth',
    showToast: options.showToast ?? true
  });
}

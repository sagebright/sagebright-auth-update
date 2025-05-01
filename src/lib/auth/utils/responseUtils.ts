
/**
 * Utilities for handling auth response processing
 */

import { logIfEnabled } from '../logging/authLogger';

/**
 * Process an authentication response with proper error handling
 */
export async function processAuthResponse(response: Response, context: string = 'auth'): Promise<any> {
  logIfEnabled("🔍 Auth response received:", {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    contentType: response.headers.get('content-type'),
    url: response.url
  }, response.ok);

  if (!response.ok) {
    await handleErrorResponse(response, context);
  }

  return await parseSuccessResponse(response, context);
}

/**
 * Handle error responses
 */
async function handleErrorResponse(response: Response, context: string): Promise<never> {
  if (response.status === 401) {
    logIfEnabled("🔍 Auth response returned 401 - Not authenticated", null, false);
    throw new Error(`Authentication required (${context})`);
  }
  
  let errorText = '';
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorText = JSON.stringify(errorData);
    } else {
      errorText = await response.text();
    }
  } catch (parseErr) {
    errorText = 'Could not parse error response';
  }
  
  throw new Error(`Auth fetch failed: ${response.status} ${errorText}`);
}

/**
 * Parse successful responses
 */
async function parseSuccessResponse(response: Response, context: string): Promise<any> {
  // Check for correct content type
  const contentType = response.headers.get('content-type');
  
  // If HTML is returned instead of JSON (common during development or API misconfiguration)
  if (!contentType || !contentType.includes('application/json')) {
    console.warn(`Warning: Auth response is not JSON: ${contentType}. This may indicate an API configuration issue.`);
    
    // Try to get the first part of the response to help with debugging
    try {
      const text = await response.text();
      console.warn('Response text (first 200 chars):', text.substring(0, 200));
      
      // For successful responses, return a simple success object as a fallback
      if (response.ok) {
        console.log(`🔄 Non-JSON success response detected for ${context}. Returning fallback object.`);
        return { 
          success: true,
          fallback: true,
          warning: "API returned HTML instead of JSON"
        };
      }
    } catch (textErr) {
      console.error('Could not get response text:', textErr);
    }
    
    throw new Error(`Expected JSON response but received: ${contentType || 'unknown content type'}`);
  }

  try {
    return await response.json();
  } catch (parseError) {
    console.error("❌ Failed to parse JSON from auth response:", parseError);
    throw new Error(`Failed to parse auth response: ${parseError}`);
  }
}

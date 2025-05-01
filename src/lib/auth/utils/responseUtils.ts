
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
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Auth response is not JSON:', contentType);
    try {
      const text = await response.text();
      console.error('Response text (first 200 chars):', text.substring(0, 200));
    } catch (textErr) {
      console.error('Could not get response text:', textErr);
    }
    throw new Error('Expected JSON response but received: ' + contentType);
  }

  try {
    return await response.json();
  } catch (parseError) {
    console.error("❌ Failed to parse JSON from auth response:", parseError);
    throw new Error(`Failed to parse auth response: ${parseError}`);
  }
}

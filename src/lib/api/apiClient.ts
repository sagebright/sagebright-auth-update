
import { supabase } from '../supabaseClient';
import { getOrgFromUrl } from '../subdomainUtils';

const API_BASE_URL = 'https://sagebright-backend-production.up.railway.app/api';

interface ApiErrorConfig {
  context?: string;
  fallbackMessage?: string;
  showToast?: boolean;
  silent?: boolean;
}

/**
 * Fetch data from the API with authentication
 */
async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('No auth token found');
  }

  const orgId = getOrgFromUrl();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(orgId ? { 'X-Organization-ID': orgId } : {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    let error;
    try {
      error = JSON.parse(text);
    } catch (e) {
      throw new Error(`Non-JSON error: ${text.slice(0, 100)}`);
    }
    throw new Error(error.message || 'API request failed');
  }

  return res.json();
}

/**
 * Generic API request with error handling
 */
export async function apiRequest(
  path: string,
  options: RequestInit = {},
  errorConfig: ApiErrorConfig = {}
) {
  try {
    return await fetchWithAuth(path, options);
  } catch (error: any) {
    const isForbiddenRoleError =
      error?.message?.includes('Forbidden: insufficient role') ||
      error?.message?.includes('403') ||
      error?.message?.includes('forbidden');

    const shouldShowToast =
      !errorConfig.silent &&
      errorConfig.showToast !== false &&
      !isForbiddenRoleError;

    if (shouldShowToast) {
      // Import handleApiError dynamically to avoid circular dependency
      const { handleApiError } = await import('../handleApiError');
      handleApiError(error, {
        context: errorConfig.context || path,
        fallbackMessage: errorConfig.fallbackMessage || 'Unable to complete request. Please try again.',
        showToast: shouldShowToast
      });
    }

    return null;
  }
}

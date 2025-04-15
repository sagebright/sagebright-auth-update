import { supabase } from './supabaseClient';
import { handleApiError } from './handleApiError';
import { getOrgFromUrl } from './subdomainUtils';

const API_BASE_URL = 'https://sagebright-backend-production.up.railway.app/api';

/**
 * Fetch data from the API with authentication
 * @param path API path
 * @param options Fetch options
 * @returns JSON response
 */
async function fetchWithAuth(path: string, options: RequestInit = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('No auth token found');
    }

    // Get organization context from URL
    const orgId = getOrgFromUrl();

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include', // Add credentials to include cookies in cross-origin requests
      headers: {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Include org context header if available
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
  } catch (error) {
    // Log the error but don't show toast - let the caller decide that
    handleApiError(error, {
      context: 'API request',
      showToast: false,
      shouldThrow: true
    });
    throw error; // Re-throw to let the caller handle it
  }
}

/**
 * Wrapper for fetchWithAuth that includes standard error handling with default options
 * @param path API path
 * @param options Fetch options
 * @param errorConfig Error handling configuration
 * @returns JSON response or null on error
 */
export async function apiRequest(
  path: string,
  options: RequestInit = {},
  errorConfig: {
    context?: string;
    fallbackMessage?: string;
    showToast?: boolean;
    silent?: boolean;
  } = {}
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

    handleApiError(error, {
      context: errorConfig.context || path,
      fallbackMessage: errorConfig.fallbackMessage || 'Unable to complete request. Please try again.',
      showToast: shouldShowToast
    });

    return null;
  }
}

/**
 * Get users from the API
 * @returns Array of users or empty array on error
 */
export async function getUsers() {
  const res = await apiRequest('/users', {}, {
    context: 'fetching users',
    fallbackMessage: 'Unable to load users. Please try again.',
    silent: true
  });
  return res?.data || [];
}

/**
 * Get departments from the API
 * @returns Array of departments or empty array on error
 */
export async function getDepartments() {
  const res = await apiRequest('/departments', {}, {
    context: 'fetching departments',
    fallbackMessage: 'Unable to load departments. Please try again.'
  });
  return res?.data || [];
}

/**
 * Get roadmaps from the API
 * @returns Array of roadmaps or empty array on error
 */
export async function getRoadmaps() {
  const res = await apiRequest('/roadmaps', {}, {
    context: 'fetching roadmaps',
    fallbackMessage: 'Unable to load roadmaps. Please try again.'
  });
  return res?.data || [];
}

/**
 * Create a generic data fetching function
 * @param path API path
 * @param errorContext Context for error messages
 * @param fallbackMessage Fallback error message
 * @returns Function that fetches data from the API
 */
export function createFetcher(path: string, errorContext: string, fallbackMessage: string) {
  return async () => {
    const res = await apiRequest(path, {}, {
      context: errorContext,
      fallbackMessage
    });
    return res?.data || [];
  };
}

/**
 * Create a generic data mutation function
 * @param path API path
 * @param method HTTP method
 * @param errorContext Context for error messages
 * @param fallbackMessage Fallback error message
 * @returns Function that mutates data in the API
 */
export function createMutation(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  errorContext: string,
  fallbackMessage: string
) {
  return async (data?: any) => {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const res = await apiRequest(path, options, {
      context: errorContext,
      fallbackMessage
    });
    return res?.data;
  };
}

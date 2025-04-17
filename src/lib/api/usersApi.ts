
import { apiRequest } from './apiClient';

/**
 * Get users from the API
 */
export async function getUsers() {
  const res = await apiRequest('/users', {}, {
    context: 'fetching users',
    fallbackMessage: 'Unable to load users. Please try again.',
    silent: true,
    useMockInDev: true
  });
  return res?.data || [];
}

/**
 * Get user context by user ID
 */
export async function getUserContextById(userId: string) {
  const res = await apiRequest(`/user/context?userId=${userId}`, {}, {
    context: 'fetching user context',
    fallbackMessage: 'Unable to load user context.',
    silent: true,
    useMockInDev: true
  });
  return res?.data || null;
}

/**
 * Get organization context by org ID
 */
export async function getOrgContextById(orgId: string) {
  const res = await apiRequest(`/org/context?orgId=${orgId}`, {}, {
    context: 'fetching organization context',
    fallbackMessage: 'Unable to load organization context.',
    silent: true,
    useMockInDev: true
  });
  return res?.data || null;
}

/**
 * Generic data fetcher creator for user-related endpoints
 */
export function createUserDataFetcher(path: string, errorContext: string, fallbackMessage: string) {
  return async () => {
    const res = await apiRequest(path, {}, {
      context: errorContext,
      fallbackMessage,
      useMockInDev: true
    });
    return res?.data || [];
  };
}

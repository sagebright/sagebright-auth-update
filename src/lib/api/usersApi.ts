
import { apiRequest } from './apiClient';

/**
 * Get users from the API
 * @deprecated This direct API call should not be used for Sage context. Use buildSageContext instead.
 */
export async function getUsers() {
  console.warn('⚠️ Legacy direct getUsers API call triggered. Consider refactoring to use buildSageContext instead');
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
 * @deprecated Direct context fetching should be handled by buildSageContext
 */
export async function getUserContextById(userId: string) {
  console.warn('⚠️ Legacy direct getUserContextById API call triggered. Use buildSageContext instead');
  // This endpoint will be called from the frontend but shouldn't exist
  // In development, we'll mock a response, in production we'll warn
  const res = await apiRequest(`/user/context?userId=${userId}`, {}, {
    context: 'fetching user context',
    fallbackMessage: 'Unable to load user context.',
    silent: true,
    useMockInDev: true,
    mockEvenIn404: true // Always mock this response even if endpoint returns 404
  });
  return res?.data || null;
}

/**
 * Get organization context by org ID
 * @deprecated Direct context fetching should be handled by buildSageContext
 */
export async function getOrgContextById(orgId: string) {
  console.warn('⚠️ Legacy direct getOrgContextById API call triggered. Use buildSageContext instead');
  // This endpoint will be called from the frontend but shouldn't exist
  // In development, we'll mock a response, in production we'll warn
  const res = await apiRequest(`/org/context?orgId=${orgId}`, {}, {
    context: 'fetching organization context',
    fallbackMessage: 'Unable to load organization context.',
    silent: true,
    useMockInDev: true,
    mockEvenIn404: true // Always mock this response even if endpoint returns 404
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

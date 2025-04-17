
import { apiRequest } from './coreApiClient';

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
    useMockInDev: true,
    validateRoute: false // Skip validation as we know this route is deprecated
  });
  return res?.data || [];
}

/**
 * Get user context by user ID
 * @deprecated Direct context fetching should be handled by buildSageContext
 */
export async function getUserContextById(userId: string) {
  console.warn('⚠️ Legacy direct getUserContextById API call triggered. Use buildSageContext instead');
  const res = await apiRequest(`/user/context?userId=${userId}`, {}, {
    context: 'fetching user context',
    fallbackMessage: 'Unable to load user context.',
    silent: true,
    useMockInDev: true,
    mockEvenIn404: true,
    validateRoute: false // Skip validation as we know this route is deprecated
  });
  return res?.data || null;
}

/**
 * Get organization context by org ID
 * @deprecated Direct context fetching should be handled by buildSageContext
 */
export async function getOrgContextById(orgId: string) {
  console.warn('⚠️ Legacy direct getOrgContextById API call triggered. Use buildSageContext instead');
  const res = await apiRequest(`/org/context?orgId=${orgId}`, {}, {
    context: 'fetching organization context',
    fallbackMessage: 'Unable to load organization context.',
    silent: true,
    useMockInDev: true,
    mockEvenIn404: true,
    validateRoute: false // Skip validation as we know this route is deprecated
  });
  return res?.data || null;
}

/**
 * Get user context via the new unified context API
 * This is the preferred method for getting context information
 */
export async function getSageUserContext(userId: string) {
  console.log('✅ Using preferred getSageUserContext API call');
  const res = await apiRequest(`/api/context/sage?userId=${userId}`, {}, {
    context: 'fetching user via sage context',
    fallbackMessage: 'Unable to load user context from Sage API.',
    silent: true,
    useMockInDev: true
  });
  return res?.data?.user || null;
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


import { apiRequest } from './apiClient';

/**
 * Get users from the API
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
 * Generic data fetcher creator for user-related endpoints
 */
export function createUserDataFetcher(path: string, errorContext: string, fallbackMessage: string) {
  return async () => {
    const res = await apiRequest(path, {}, {
      context: errorContext,
      fallbackMessage
    });
    return res?.data || [];
  };
}

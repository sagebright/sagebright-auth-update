
import { apiRequest } from './apiClient';

/**
 * Get departments from the API
 */
export async function getDepartments() {
  const res = await apiRequest('/departments', {}, {
    context: 'fetching departments',
    fallbackMessage: 'Unable to load departments. Please try again.'
  });
  return res?.data || [];
}

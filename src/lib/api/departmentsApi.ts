
import { apiRequest } from './apiClient';

/**
 * Get departments from the API
 * @deprecated This API endpoint may not exist in production environments
 */
export async function getDepartments() {
  console.warn('⚠️ getDepartments API call to potentially invalid route');
  const res = await apiRequest('/departments', {}, {
    context: 'fetching departments',
    fallbackMessage: 'Unable to load departments. Please try again.',
    useMockInDev: true,
    validateRoute: false // Skip validation as we know this route may not exist
  });
  return res?.data || [];
}

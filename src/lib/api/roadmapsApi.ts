
import { apiRequest } from './coreApiClient';

/**
 * Get roadmaps from the API
 * @deprecated This API endpoint may not exist in production environments
 */
export async function getRoadmaps() {
  console.warn('⚠️ getRoadmaps API call to potentially invalid route');
  const res = await apiRequest('/roadmaps', {}, {
    context: 'fetching roadmaps',
    fallbackMessage: 'Unable to load roadmaps. Please try again.',
    useMockInDev: true,
    validateRoute: false // Skip validation as we know this route may not exist
  });
  return res?.data || [];
}

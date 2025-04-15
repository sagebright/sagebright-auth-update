
import { apiRequest } from './apiClient';

/**
 * Get roadmaps from the API
 */
export async function getRoadmaps() {
  const res = await apiRequest('/roadmaps', {}, {
    context: 'fetching roadmaps',
    fallbackMessage: 'Unable to load roadmaps. Please try again.'
  });
  return res?.data || [];
}


/**
 * Base API client for making requests to the backend
 * with improved route validation and safety
 */

// Export main API functionality
export { apiRequest } from './coreApiClient';
export { 
  fetchContextData,
  getUserContext,
  getOrgContext
} from './deprecatedApis';
export type { ApiRequestOptions, ApiResponse } from './types';

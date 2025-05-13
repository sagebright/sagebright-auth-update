
/**
 * Type definitions for the API client
 */

export interface ApiRequestOptions {
  // Core options
  context?: string;
  fallbackMessage?: string;
  timeout?: number;
  abortSignal?: AbortSignal;
  
  // Extended options that were causing errors
  silent?: boolean;
  useMockInDev?: boolean;
  mockEvenIn404?: boolean;
  validateRoute?: boolean;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status?: number;
  data?: T;
  error?: string;
  errorDetails?: unknown;
}

export interface MockResponseProvider {
  getResponseForEndpoint: (endpoint: string) => ApiResponse;
}

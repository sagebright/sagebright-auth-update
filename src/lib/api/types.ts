
/**
 * Type definitions for the API client
 */

export interface ApiRequestOptions {
  context?: string;
  fallbackMessage?: string;
  silent?: boolean;
  useMockInDev?: boolean;
  mockEvenIn404?: boolean;
  validateRoute?: boolean;
  timeout?: number;
  abortSignal?: AbortSignal;
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

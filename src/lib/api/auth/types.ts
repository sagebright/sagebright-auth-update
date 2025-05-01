
/**
 * Types for auth API operations
 */

// Base request tracking
export interface AuthApiRequestState {
  inProgress: boolean;
  lastAttempt: number;
}

// Auth response data
export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

// Options for API calls
export interface AuthApiOptions {
  context?: string;
  showToast?: boolean;
  silentErrors?: boolean;
  timeout?: number;
}

// Request tracking
export const activeAuthRequests: Record<string, AuthApiRequestState> = {};


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
  fallback?: boolean;  // Added fallback property to support HTML responses
  warning?: string;    // Added for warning messages
}

// Options for API calls
export interface AuthApiOptions {
  context?: string;
  showToast?: boolean;
  silentErrors?: boolean;
  timeout?: number;
}

// Auth session payload structure
export interface AuthPayload {
  session: any | null;
  user: any | null;
  org: any | null;
  fallback?: boolean;  // Added fallback property to support HTML responses
  warning?: string;    // Added for warning messages
}

// Request tracking
export const activeAuthRequests: Record<string, AuthApiRequestState> = {};

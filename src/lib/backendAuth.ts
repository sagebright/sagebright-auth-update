
/**
 * Backend authentication client for Sagebright (refactored - delegates to modules)
 */

import { setAuthLogging } from './auth/logging/authLogger';
import { setCookieLogging } from './auth/cookies/cookieDetection';

export { fetchAuth, checkAuth, resetAuthState } from './authApi';
export type { AuthPayload } from './api/auth/types';

export { hasAuthCookie } from './auth/cookies/cookieDetection';

// Expose a utility to enable/disable verbose auth logging
export function configureAuthLogging(enabled: boolean = false) {
  setAuthLogging(enabled);
  setCookieLogging(enabled);
}

// Default to disabled for production, enabled for development
if (import.meta.env.DEV) {
  // Enable detailed logging in development but throttled
  configureAuthLogging(false); // Changed to false by default even in dev to reduce spam
} else {
  // Disable detailed logging in production
  configureAuthLogging(false);
}

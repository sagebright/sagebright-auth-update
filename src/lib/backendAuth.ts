
/**
 * Backend authentication client for Sagebright (refactored - delegates to modules)
 */

import { setAuthLogging } from './authCache';
import { setCookieLogging } from './authCookies';

export { fetchAuth, checkAuth, resetAuthState } from './authApi';
export type { AuthPayload } from './authApi';

export { hasAuthCookie } from './authCookies';

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


/**
 * Backend authentication client for Sagebright (refactored - delegates to modules)
 */

import { setAuthLogging } from './authCache';

export { fetchAuth, checkAuth, resetAuthState } from './authApi';
export type { AuthPayload } from './authApi';

export { hasAuthCookie } from './authCookies';

// Expose a utility to enable/disable verbose auth logging
export function configureAuthLogging(enabled: boolean = false) {
  setAuthLogging(enabled);
}

// Default to disabled for production, enabled for development
if (import.meta.env.DEV) {
  // Enable detailed logging in development
  configureAuthLogging(true);
} else {
  // Disable detailed logging in production
  configureAuthLogging(false);
}

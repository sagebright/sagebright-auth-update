
/**
 * Backend authentication client for Sagebright (refactored - delegates to modules)
 */

export { fetchAuth, checkAuth, resetAuthState } from './authApi';
export type { AuthPayload } from './authApi';

export { hasAuthCookie } from './authCookies';

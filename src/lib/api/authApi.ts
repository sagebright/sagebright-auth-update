
/**
 * Auth API - Provides clean interface for auth-related API operations
 */

// Re-export all auth operations
export {
  signIn,
  signOut,
  signUp,
  resetPassword,
  getAuthSession
} from './auth/authOperations';

export type { AuthResponse, AuthApiOptions } from './auth/types';

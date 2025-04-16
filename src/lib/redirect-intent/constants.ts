
import { RedirectIntentOptions } from './types';

/**
 * Default configuration options for the redirect intent manager
 */
export const DEFAULT_OPTIONS: RedirectIntentOptions = {
  maxHistory: 5,
  defaultExpiryMs: 30 * 60 * 1000, // 30 minutes
  enableLogging: true,
  storageKey: 'sagebright_redirect_intent',
  defaultPriority: 0,
  cleanupStaleIntents: true
};

export const STORAGE_KEY = 'sagebright_redirect_intent';
export const MAX_RECENT_INTENTS = 5;
export const DEFAULT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

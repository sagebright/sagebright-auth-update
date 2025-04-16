
/**
 * Constants related to voice parameter management
 */

/**
 * Possible sources of voice parameters in order of typical priority
 */
export type VoiceParamSource = 'url' | 'storage' | 'intent' | 'default';

/**
 * Priority values for different voice parameter sources
 */
export const VOICE_PARAM_PRIORITIES = {
  URL: 100,      // Highest priority - explicit user choice
  INTENT: 90,    // Second highest - preserved through redirects
  STORAGE: 80,   // Third highest - persistent but lower priority
  DEFAULT: 0     // Lowest priority - fallback
};

/**
 * Storage keys for voice parameter persistence
 */
export const STORAGE_KEYS = {
  LAST_VOICE_PARAM: 'lastVoiceParam',
  LAST_VOICE_PARAM_TIMESTAMP: 'lastVoiceParamTimestamp'
};

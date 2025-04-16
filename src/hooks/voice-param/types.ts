
/**
 * Types related to voice parameter management
 */

import { VoiceParamSource } from './constants';

/**
 * State representing the current voice parameter configuration
 */
export interface VoiceParamState {
  currentVoice: string;
  previousVoice: string | null;
  source: VoiceParamSource;
  timestamp: number;
  isValid: boolean;
  sourceDetails?: {
    urlParam?: string;
    intentId?: string;
    storageTimestamp?: number;
  };
}

/**
 * Candidate for voice parameter source with priority information
 */
export interface VoiceSourceCandidate {
  value: string;
  source: VoiceParamSource;
  priority: number;
  isValid: boolean;
  timestamp: number;
  sourceDetails?: Record<string, any>;
}

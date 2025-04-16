
/**
 * Functions to collect and validate voice parameter sources
 */

import { getVoiceFromUrl } from '@/lib/utils';
import { VoiceSourceCandidate } from './types';
import { validateVoice } from './utils';
import { VOICE_PARAM_PRIORITIES } from './constants';

/**
 * Collect voice parameter from URL search params
 * @param search The search string from location
 * @returns Voice source candidate or null if not present
 */
export function collectUrlVoiceSource(search: string): VoiceSourceCandidate | null {
  if (!search.includes('voice=')) return null;
  
  const voiceFromUrl = getVoiceFromUrl(search);
  const isUrlVoiceValid = validateVoice(voiceFromUrl);
  
  return {
    value: voiceFromUrl,
    source: 'url',
    priority: VOICE_PARAM_PRIORITIES.URL,
    isValid: isUrlVoiceValid,
    timestamp: Date.now(),
    sourceDetails: { urlParam: search }
  };
}

/**
 * Collect voice parameter from redirect intent
 * @param activeIntent The active redirect intent
 * @returns Voice source candidate or null if not present
 */
export function collectIntentVoiceSource(activeIntent: any): VoiceSourceCandidate | null {
  const intentVoice = activeIntent?.metadata?.voiceParam;
  if (!intentVoice) return null;
  
  const isIntentVoiceValid = validateVoice(intentVoice);
  
  return {
    value: intentVoice,
    source: 'intent',
    priority: VOICE_PARAM_PRIORITIES.INTENT,
    isValid: isIntentVoiceValid,
    timestamp: activeIntent.timestamp || Date.now(),
    sourceDetails: { 
      intentId: activeIntent.metadata?.intentId,
      intentDestination: activeIntent.destination 
    }
  };
}

/**
 * Collect voice parameter from localStorage
 * @returns Voice source candidate or null if not present
 */
export function collectStorageVoiceSource(): VoiceSourceCandidate | null {
  const storedVoice = localStorage.getItem('lastVoiceParam');
  const storedTimestamp = localStorage.getItem('lastVoiceParamTimestamp');
  
  if (!storedVoice) return null;
  
  const isStoredVoiceValid = validateVoice(storedVoice);
  
  return {
    value: storedVoice,
    source: 'storage',
    priority: VOICE_PARAM_PRIORITIES.STORAGE,
    isValid: isStoredVoiceValid,
    timestamp: storedTimestamp ? parseInt(storedTimestamp, 10) : 0,
    sourceDetails: { 
      storageTimestamp: storedTimestamp ? parseInt(storedTimestamp, 10) : undefined 
    }
  };
}

/**
 * Get default voice parameter as fallback
 * @returns Voice source candidate with default values
 */
export function getDefaultVoiceSource(): VoiceSourceCandidate {
  return {
    value: 'default',
    source: 'default',
    priority: VOICE_PARAM_PRIORITIES.DEFAULT,
    isValid: true,
    timestamp: 0
  };
}

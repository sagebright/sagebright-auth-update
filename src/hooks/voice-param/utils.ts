
/**
 * Utility functions for voice parameter management
 */

import { voiceprints } from '@/lib/voiceprints';
import { VoiceSourceCandidate } from './types';

/**
 * Validates if a voice parameter is valid (exists in voiceprints)
 * @param voice The voice parameter to validate
 * @returns Boolean indicating if the voice is valid
 */
export function validateVoice(voice: string | null | undefined): boolean {
  if (!voice) return false;
  return voice in voiceprints || voice === 'default';
}

/**
 * Choose the best voice parameter from all available sources
 * @param sources Array of voice source candidates
 * @returns The best voice source candidate based on priority and timestamp
 */
export function selectBestVoiceSource(sources: VoiceSourceCandidate[]): VoiceSourceCandidate {
  // Filter for valid sources
  const validSources = sources.filter(s => s.isValid);
  
  if (validSources.length === 0) {
    console.log('🎤 No valid voice sources found, defaulting to "default"');
    return {
      value: 'default',
      source: 'default',
      priority: 0,
      isValid: true,
      timestamp: Date.now()
    };
  }
  
  // Sort by priority (descending) then by timestamp (descending)
  validSources.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Higher priority first
    }
    return b.timestamp - a.timestamp; // Newer timestamp first
  });
  
  const selected = validSources[0];
  console.log(`🎤 Selected voice source: ${selected.source} (${selected.value})`);
  return selected;
}

/**
 * Store voice parameter in localStorage for persistence
 * @param voice Voice parameter to store
 */
export function persistVoiceParam(voice: string): void {
  if (voice && voice !== 'default') {
    localStorage.setItem('lastVoiceParam', voice);
    localStorage.setItem('lastVoiceParamTimestamp', Date.now().toString());
  }
}

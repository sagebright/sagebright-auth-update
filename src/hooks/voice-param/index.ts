
/**
 * Public API for voice parameter hooks and utilities
 */

import { useVoiceStateManager } from './use-voice-state-manager';
import { useLocation } from 'react-router-dom';
import { VoiceParamState } from './types';

/**
 * Enhanced hook that manages voice parameter state with better tracing and validation
 * Now fully integrated with intent system for persistence across page transitions
 * @returns A string representing the current voice parameter
 */
export function useVoiceParam(): string {
  const voiceState = useVoiceStateManager();
  return voiceState.currentVoice;
}

/**
 * Returns detailed information about the voice parameter state
 * Useful for debugging and analytics
 */
export function useVoiceParamState(): VoiceParamState {
  return useVoiceStateManager();
}

/**
 * Hook to check if the current voice parameter was provided explicitly via URL
 * This is useful to determine if the voice param should be persisted or replaced
 */
export function useExplicitVoiceParam(): boolean {
  const location = useLocation();
  return location.search.includes('voice=');
}

// Re-export types for consumers
export type { VoiceParamState } from './types';
export type { VoiceParamSource } from './constants';


import { ReadinessCheck } from '../types';

/**
 * Function to check if voice parameter is ready
 */
export function checkVoiceReadiness(
  voiceParam: string | null
): ReadinessCheck {
  const blockers: string[] = [];
  
  if (!voiceParam) {
    blockers.push('Voice parameter not available');
  }
  
  // In development mode, provide a default voice if missing
  if (process.env.NODE_ENV === 'development' && blockers.length > 0) {
    console.info('🧪 Development mode: Using default voice parameter');
    return {
      isReady: true,
      blockers: []
    };
  }
  
  return {
    isReady: blockers.length === 0,
    blockers
  };
}

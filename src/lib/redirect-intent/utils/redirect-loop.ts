
import { RedirectIntent } from '../types';
import { createIntentAuditLog } from '../utils';

/**
 * Detects potential redirect loops by checking frequency of redirects
 */
export function detectRedirectLoop(recentIntents: RedirectIntent[]): boolean {
  if (recentIntents.length < 3) {
    return false;
  }
  
  // Check if we have 3+ redirects to the same destination in a short time window
  const last3Intents = recentIntents.slice(-3);
  const sameDestination = last3Intents.every(intent => 
    intent.destination === last3Intents[0].destination
  );
  
  // Check if these redirects happened within 5 seconds of each other
  const timeWindow = last3Intents[last3Intents.length - 1].timestamp - last3Intents[0].timestamp;
  const tooFrequent = timeWindow < 5000; // 5 seconds
  
  if (sameDestination && tooFrequent) {
    console.error('🔄🔄🔄 Detected potential redirect loop!', { 
      destination: last3Intents[0].destination,
      intentIds: last3Intents.map(i => i.metadata?.intentId),
      timeWindowMs: timeWindow
    });
    return true;
  }
  
  return false;
}

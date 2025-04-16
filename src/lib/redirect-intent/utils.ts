
import { RedirectIntent, IntentValidationResult } from './types';

const DEFAULT_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = 'sagebright_redirect_intent';
const MAX_RECENT_INTENTS = 5;

/**
 * Validates a redirect intent to ensure it's still valid
 */
export function validateIntent(intent: RedirectIntent | null): IntentValidationResult {
  if (!intent) {
    return { isValid: false, reason: 'No intent provided' };
  }

  // Check if the intent has expired
  if (intent.expiry && Date.now() > intent.expiry) {
    return { isValid: false, reason: 'Intent has expired' };
  }

  // Check if the destination is valid
  if (!intent.destination || typeof intent.destination !== 'string') {
    return { isValid: false, reason: 'Invalid destination' };
  }

  // Validate that the destination is safe (not redirecting to external sites)
  if (intent.destination.startsWith('http') && !intent.destination.includes(window.location.host)) {
    return { isValid: false, reason: 'External redirects not allowed' };
  }

  return { isValid: true };
}

/**
 * Sanitizes a redirect path for safety
 */
export function sanitizePath(path: string): string {
  // Remove any potential script injections
  let sanitized = path.replace(/<\/?script.*?>/gi, '');
  
  // Ensure path starts with /
  if (!sanitized.startsWith('/')) {
    sanitized = '/' + sanitized;
  }
  
  return sanitized;
}

/**
 * Creates a new redirect intent
 */
export function createRedirectIntent(
  destination: string,
  reason: RedirectIntent['reason'],
  metadata?: RedirectIntent['metadata'],
  expiryMs: number = DEFAULT_EXPIRY_MS,
  priority: number = 0
): RedirectIntent {
  const now = Date.now();
  const intentId = generateIntentId();
  
  // Merge existing metadata with new metadata
  const enhancedMetadata = {
    ...metadata,
    intentId,
    source: metadata?.source || window.location.pathname + window.location.search
  };
  
  return {
    destination: sanitizePath(destination),
    reason,
    timestamp: now,
    metadata: enhancedMetadata,
    expiry: now + expiryMs,
    priority
  };
}

/**
 * Generates a unique ID for tracing intents through logs
 */
function generateIntentId(): string {
  return `intent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Persists a redirect intent to storage
 */
export function persistIntent(intent: RedirectIntent): boolean {
  try {
    const serialized = JSON.stringify(intent);
    localStorage.setItem(STORAGE_KEY, serialized);
    
    const timestamp = new Date().toISOString();
    console.log(`🔄 [${timestamp}] Persisted redirect intent:`, { 
      intentId: intent.metadata?.intentId,
      destination: intent.destination, 
      reason: intent.reason,
      priority: intent.priority,
      expiry: new Date(intent.expiry || 0).toISOString() 
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to persist redirect intent:', error);
    return false;
  }
}

/**
 * Retrieves a redirect intent from storage
 */
export function retrieveIntent(): RedirectIntent | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    
    if (!serialized) {
      return null;
    }
    
    const intent = JSON.parse(serialized) as RedirectIntent;
    const validation = validateIntent(intent);
    
    if (!validation.isValid) {
      console.warn(`⚠️ Retrieved invalid intent: ${validation.reason}`);
      clearPersistedIntent();
      return null;
    }
    
    return intent;
  } catch (error) {
    console.error('❌ Failed to retrieve redirect intent:', error);
    clearPersistedIntent();
    return null;
  }
}

/**
 * Clears a persisted redirect intent
 */
export function clearPersistedIntent(): void {
  try {
    const existingIntent = retrieveIntent();
    if (existingIntent) {
      console.log('🧹 Clearing persisted redirect intent:', {
        intentId: existingIntent.metadata?.intentId,
        destination: existingIntent.destination
      });
    }
    
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('❌ Error clearing persisted intent:', error);
  }
}

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

/**
 * Updates recent intents history while maintaining maximum length
 */
export function updateRecentIntents(
  recentIntents: RedirectIntent[],
  newIntent: RedirectIntent,
  maxHistory: number = MAX_RECENT_INTENTS
): RedirectIntent[] {
  const updated = [...recentIntents, newIntent];
  
  // Keep only the most recent intents up to maxHistory
  return updated.slice(-maxHistory);
}

/**
 * Cleans up stale intents from storage
 */
export function cleanupStaleIntents(): void {
  try {
    const intent = retrieveIntent();
    
    if (intent && intent.expiry && Date.now() > intent.expiry) {
      console.log('🧹 Cleaning up stale intent:', {
        intentId: intent.metadata?.intentId,
        destination: intent.destination,
        expiredAgo: Date.now() - intent.expiry
      });
      
      clearPersistedIntent();
    }
  } catch (error) {
    console.error('❌ Error cleaning up stale intents:', error);
  }
}

/**
 * Determines if a new intent should replace an existing one based on priority and timestamp
 */
export function shouldReplaceIntent(existingIntent: RedirectIntent | null, newIntent: RedirectIntent): boolean {
  // If no existing intent, always use the new one
  if (!existingIntent) {
    return true;
  }
  
  // Check if existing intent has expired
  if (existingIntent.expiry && Date.now() > existingIntent.expiry) {
    return true;
  }
  
  // Higher priority intents replace lower priority ones
  if ((newIntent.priority || 0) > (existingIntent.priority || 0)) {
    return true;
  }
  
  // For equal priority, prefer the newer intent
  if ((newIntent.priority || 0) === (existingIntent.priority || 0) && 
      newIntent.timestamp > existingIntent.timestamp) {
    return true;
  }
  
  return false;
}

/**
 * Creates enhanced logging information about intent transitions
 */
export function createIntentAuditLog(
  action: 'create' | 'execute' | 'clear' | 'block' | 'validate',
  intent: RedirectIntent | null,
  details?: Record<string, unknown>
): Record<string, unknown> {
  const now = new Date().toISOString();
  
  return {
    timestamp: now,
    action,
    intent: intent ? {
      intentId: intent.metadata?.intentId,
      destination: intent.destination,
      reason: intent.reason,
      age: intent ? Date.now() - intent.timestamp : null,
      priority: intent.priority
    } : null,
    currentPath: window.location.pathname + window.location.search,
    ...details
  };
}


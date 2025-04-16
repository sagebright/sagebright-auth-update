
import { RedirectIntent, IntentValidationResult } from './types';
import { DEFAULT_EXPIRY_MS } from './constants';

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
export function generateIntentId(): string {
  return `intent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Updates recent intents history while maintaining maximum length
 */
export function updateRecentIntents(
  recentIntents: RedirectIntent[],
  newIntent: RedirectIntent,
  maxHistory: number = 5
): RedirectIntent[] {
  const updated = [...recentIntents, newIntent];
  
  // Keep only the most recent intents up to maxHistory
  return updated.slice(-maxHistory);
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

// Re-export storage functions to maintain backward compatibility
// This helps prevent breaking changes for files still importing from utils.ts
export { 
  persistIntent, 
  retrieveIntent, 
  clearPersistedIntent, 
  cleanupStaleIntents 
} from './utils/storage';

// Re-export redirect-loop functions
export { detectRedirectLoop } from './utils/redirect-loop';


import { RedirectIntent } from '../types';
import { validateIntent } from '../utils';
import { STORAGE_KEY } from '../constants';

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

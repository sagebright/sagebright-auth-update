
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RedirectIntent, 
  RedirectIntentState,
  RedirectIntentOptions,
  RedirectReason
} from '../types';
import {
  createRedirectIntent,
  persistIntent,
  retrieveIntent,
  clearPersistedIntent,
  validateIntent,
  updateRecentIntents,
  shouldReplaceIntent,
  createIntentAuditLog
} from '../utils';
import { detectRedirectLoop } from '../utils/redirect-loop';
import { cleanupStaleIntents } from '../utils/storage';
import { DEFAULT_OPTIONS } from '../constants';

export function useRedirectIntentManager(options: RedirectIntentOptions = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef<number | null>(null);
  const navigationLockRef = useRef<boolean>(false);
  
  const [state, setState] = useState<RedirectIntentState>({
    activeIntent: null,
    redirectInProgress: false,
    recentIntents: [],
    isBlocked: false,
    blockReason: undefined,
    status: 'idle'
  });
  
  // Initialize by checking for a stored intent and cleaning up stale intents
  useEffect(() => {
    // Optional cleanup of stale intents on mount
    if (mergedOptions.cleanupStaleIntents) {
      cleanupStaleIntents();
    }
    
    const storedIntent = retrieveIntent();
    
    if (storedIntent) {
      const validation = validateIntent(storedIntent);
      
      if (validation.isValid) {
        if (mergedOptions.enableLogging) {
          console.log('🔍 Found stored redirect intent:', createIntentAuditLog(
            'validate',
            storedIntent,
            { valid: true }
          ));
        }
        
        setState(prev => ({
          ...prev,
          activeIntent: storedIntent,
          status: 'idle'
        }));
      } else {
        console.warn(`⚠️ Discarding invalid stored intent:`, createIntentAuditLog(
          'validate',
          storedIntent,
          { valid: false, reason: validation.reason }
        ));
        clearPersistedIntent();
      }
    }
    
    // Set up unload handler to detect tab closures during redirects
    const handleBeforeUnload = () => {
      if (state.redirectInProgress) {
        console.log('⚠️ Page unloading during active redirect - intent preserved for next load');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Clear any pending redirect timeouts on unmount
      if (redirectTimeoutRef.current !== null) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [mergedOptions.enableLogging, mergedOptions.cleanupStaleIntents, state.redirectInProgress]);
  
  // Check for potential redirect loops
  useEffect(() => {
    if (detectRedirectLoop(state.recentIntents)) {
      setState(prev => ({
        ...prev,
        isBlocked: true,
        blockReason: 'Redirect loop detected',
        status: 'failed',
        error: {
          code: 'REDIRECT_LOOP',
          message: 'Redirect loop detected and blocked',
          details: {
            recentIntents: prev.recentIntents.map(i => ({
              destination: i.destination,
              timestamp: i.timestamp,
              intentId: i.metadata?.intentId
            }))
          }
        }
      }));
      
      console.error('🚫 Blocking redirects due to detected loop:', createIntentAuditLog(
        'block',
        state.activeIntent,
        { reason: 'Redirect loop detected' }
      ));
    }
  }, [state.recentIntents]);
  
  /**
   * Capture a redirect intent and store it
   */
  const captureIntent = useCallback((
    destination: string,
    reason: RedirectReason,
    metadata?: RedirectIntent['metadata'],
    priority?: number
  ) => {
    setState(prev => ({ ...prev, status: 'capturing' }));
    
    const intent = createRedirectIntent(
      destination,
      reason,
      metadata,
      mergedOptions.defaultExpiryMs,
      priority ?? mergedOptions.defaultPriority
    );
    
    // Only replace existing intent if the new one has higher priority or is newer
    const existingIntent = retrieveIntent();
    
    if (existingIntent && !shouldReplaceIntent(existingIntent, intent)) {
      console.log('⚠️ Not replacing existing intent with lower priority:', createIntentAuditLog(
        'create',
        intent,
        { 
          action: 'skipped',
          existingIntent: {
            destination: existingIntent.destination,
            priority: existingIntent.priority,
            intentId: existingIntent.metadata?.intentId
          }
        }
      ));
      
      setState(prev => ({ ...prev, status: 'idle' }));
      return existingIntent;
    }
    
    if (mergedOptions.enableLogging) {
      console.group('📝 Capturing redirect intent');
      console.log(createIntentAuditLog('create', intent));
      console.groupEnd();
    }
    
    // Update state
    setState(prev => {
      const updatedIntents = updateRecentIntents(
        prev.recentIntents,
        intent,
        mergedOptions.maxHistory
      );
      
      return {
        ...prev,
        activeIntent: intent,
        recentIntents: updatedIntents,
        status: 'idle'
      };
    });
    
    // Persist to storage
    persistIntent(intent);
    
    return intent;
  }, [
    mergedOptions.defaultExpiryMs, 
    mergedOptions.enableLogging, 
    mergedOptions.maxHistory,
    mergedOptions.defaultPriority
  ]);
  
  const { cancelRedirect, executeRedirect, clearIntent, resetBlockedState } = useRedirectActions(
    state,
    setState,
    redirectTimeoutRef,
    navigationLockRef,
    navigate,
    mergedOptions.enableLogging
  );
  
  return {
    // State
    activeIntent: state.activeIntent,
    redirectInProgress: state.redirectInProgress,
    isBlocked: state.isBlocked,
    blockReason: state.blockReason,
    status: state.status,
    error: state.error,
    
    // Actions
    captureIntent,
    executeRedirect,
    clearIntent,
    resetBlockedState,
    cancelRedirect
  };
}

// Import the useRedirectActions hook
import { useRedirectActions } from './use-redirect-actions';

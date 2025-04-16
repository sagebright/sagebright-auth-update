
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RedirectIntent, 
  RedirectIntentState,
  RedirectIntentOptions,
  RedirectReason
} from './types';
import {
  createRedirectIntent,
  persistIntent,
  retrieveIntent,
  clearPersistedIntent,
  validateIntent,
  updateRecentIntents,
  detectRedirectLoop
} from './utils';

const DEFAULT_OPTIONS: RedirectIntentOptions = {
  maxHistory: 5,
  defaultExpiryMs: 30 * 60 * 1000, // 30 minutes
  enableLogging: true,
  storageKey: 'sagebright_redirect_intent'
};

export function useRedirectIntentManager(options: RedirectIntentOptions = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef<number | null>(null);
  
  const [state, setState] = useState<RedirectIntentState>({
    activeIntent: null,
    redirectInProgress: false,
    recentIntents: [],
    isBlocked: false,
    blockReason: undefined
  });
  
  // Initialize by checking for a stored intent
  useEffect(() => {
    const storedIntent = retrieveIntent();
    
    if (storedIntent) {
      const validation = validateIntent(storedIntent);
      
      if (validation.isValid) {
        if (mergedOptions.enableLogging) {
          console.log('🔍 Found stored redirect intent:', {
            destination: storedIntent.destination,
            reason: storedIntent.reason,
            age: Date.now() - storedIntent.timestamp
          });
        }
        
        setState(prev => ({
          ...prev,
          activeIntent: storedIntent
        }));
      } else {
        console.warn(`⚠️ Discarding invalid stored intent: ${validation.reason}`);
        clearPersistedIntent();
      }
    }
  }, [mergedOptions.enableLogging]);
  
  // Check for potential redirect loops
  useEffect(() => {
    if (detectRedirectLoop(state.recentIntents)) {
      setState(prev => ({
        ...prev,
        isBlocked: true,
        blockReason: 'Redirect loop detected'
      }));
      
      console.error('🚫 Blocking redirects due to detected loop');
    }
  }, [state.recentIntents]);
  
  /**
   * Capture a redirect intent and store it
   */
  const captureIntent = useCallback((
    destination: string,
    reason: RedirectReason,
    metadata?: RedirectIntent['metadata']
  ) => {
    const intent = createRedirectIntent(
      destination,
      reason,
      metadata,
      mergedOptions.defaultExpiryMs
    );
    
    if (mergedOptions.enableLogging) {
      console.group('📝 Capturing redirect intent');
      console.log('Destination:', destination);
      console.log('Reason:', reason);
      console.log('Metadata:', metadata);
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
        recentIntents: updatedIntents
      };
    });
    
    // Persist to storage
    persistIntent(intent);
    
    return intent;
  }, [mergedOptions.defaultExpiryMs, mergedOptions.enableLogging, mergedOptions.maxHistory]);
  
  /**
   * Execute a redirect based on the active intent
   */
  const executeRedirect = useCallback((intent?: RedirectIntent) => {
    const targetIntent = intent || state.activeIntent;
    
    if (!targetIntent) {
      console.warn('⚠️ No intent available to execute redirect');
      return false;
    }
    
    if (state.isBlocked) {
      console.error(`🚫 Redirect blocked: ${state.blockReason}`);
      return false;
    }
    
    const validation = validateIntent(targetIntent);
    if (!validation.isValid) {
      console.error(`❌ Cannot execute invalid redirect: ${validation.reason}`);
      return false;
    }
    
    if (state.redirectInProgress) {
      console.warn('⚠️ Redirect already in progress, ignoring new request');
      return false;
    }
    
    // Set redirect in progress
    setState(prev => ({
      ...prev,
      redirectInProgress: true
    }));
    
    if (mergedOptions.enableLogging) {
      console.group('🚀 Executing redirect');
      console.log('Destination:', targetIntent.destination);
      console.log('Reason:', targetIntent.reason);
      console.log('Age:', Date.now() - targetIntent.timestamp, 'ms');
      console.groupEnd();
    }
    
    // Execute the redirect with a small delay to allow state updates
    redirectTimeoutRef.current = window.setTimeout(() => {
      navigate(targetIntent.destination, { replace: true });
      
      // Reset redirect in progress after navigation
      setState(prev => ({
        ...prev,
        redirectInProgress: false
      }));
    }, 50);
    
    return true;
  }, [state.activeIntent, state.isBlocked, state.redirectInProgress, state.blockReason, navigate, mergedOptions.enableLogging]);
  
  /**
   * Clear the active intent
   */
  const clearIntent = useCallback(() => {
    clearPersistedIntent();
    
    setState(prev => ({
      ...prev,
      activeIntent: null
    }));
    
    if (mergedOptions.enableLogging) {
      console.log('🧹 Cleared active redirect intent');
    }
  }, [mergedOptions.enableLogging]);
  
  /**
   * Reset the blocked state
   */
  const resetBlockedState = useCallback(() => {
    setState(prev => ({
      ...prev,
      isBlocked: false,
      blockReason: undefined
    }));
    
    if (mergedOptions.enableLogging) {
      console.log('🔓 Reset redirect blocked state');
    }
  }, [mergedOptions.enableLogging]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    // State
    activeIntent: state.activeIntent,
    redirectInProgress: state.redirectInProgress,
    isBlocked: state.isBlocked,
    blockReason: state.blockReason,
    
    // Actions
    captureIntent,
    executeRedirect,
    clearIntent,
    resetBlockedState
  };
}

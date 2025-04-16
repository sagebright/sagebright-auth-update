
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
  detectRedirectLoop,
  cleanupStaleIntents,
  shouldReplaceIntent,
  createIntentAuditLog
} from './utils';

const DEFAULT_OPTIONS: RedirectIntentOptions = {
  maxHistory: 5,
  defaultExpiryMs: 30 * 60 * 1000, // 30 minutes
  enableLogging: true,
  storageKey: 'sagebright_redirect_intent',
  defaultPriority: 0,
  cleanupStaleIntents: true
};

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
  
  /**
   * Cancels any pending redirect
   */
  const cancelRedirect = useCallback(() => {
    if (redirectTimeoutRef.current !== null) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
      
      console.log('🚫 Cancelled pending redirect:', createIntentAuditLog(
        'block',
        state.activeIntent,
        { reason: 'Explicitly cancelled' }
      ));
      
      setState(prev => ({
        ...prev,
        redirectInProgress: false,
        status: 'idle'
      }));
      
      return true;
    }
    
    return false;
  }, [state.activeIntent]);
  
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
      console.error(`🚫 Redirect blocked:`, createIntentAuditLog(
        'block',
        targetIntent,
        { reason: state.blockReason }
      ));
      return false;
    }
    
    // Cancel any existing redirect first
    cancelRedirect();
    
    const validation = validateIntent(targetIntent);
    if (!validation.isValid) {
      console.error(`❌ Cannot execute invalid redirect:`, createIntentAuditLog(
        'validate',
        targetIntent,
        { valid: false, reason: validation.reason }
      ));
      
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: {
          code: 'INVALID_INTENT',
          message: validation.reason || 'Invalid redirect intent',
          details: { intent: targetIntent }
        }
      }));
      
      return false;
    }
    
    if (state.redirectInProgress || navigationLockRef.current) {
      console.warn('⚠️ Redirect already in progress, ignoring new request');
      return false;
    }
    
    // Prevent competing redirects
    navigationLockRef.current = true;
    
    // Set redirect in progress
    setState(prev => ({
      ...prev,
      redirectInProgress: true,
      status: 'executing'
    }));
    
    if (mergedOptions.enableLogging) {
      console.group('🚀 Executing redirect');
      console.log(createIntentAuditLog('execute', targetIntent));
      console.groupEnd();
    }
    
    // Execute the redirect with a small delay to allow state updates
    redirectTimeoutRef.current = window.setTimeout(() => {
      // Double-check that we still want to execute this redirect
      if (!navigationLockRef.current) {
        console.log('🛑 Redirect cancelled during timeout');
        setState(prev => ({
          ...prev,
          redirectInProgress: false,
          status: 'idle'
        }));
        return;
      }
      
      navigate(targetIntent.destination, { replace: true });
      
      // Reset navigation lock
      navigationLockRef.current = false;
      redirectTimeoutRef.current = null;
      
      // Reset redirect in progress and set status to completed
      setState(prev => ({
        ...prev,
        redirectInProgress: false,
        status: 'completed'
      }));
      
      console.log(`✅ Redirect successfully executed to: ${targetIntent.destination}`);
    }, 50);
    
    return true;
  }, [
    state.activeIntent, 
    state.isBlocked, 
    state.redirectInProgress, 
    state.blockReason, 
    navigate, 
    mergedOptions.enableLogging,
    cancelRedirect
  ]);
  
  /**
   * Clear the active intent
   */
  const clearIntent = useCallback(() => {
    const currentIntent = state.activeIntent;
    
    clearPersistedIntent();
    
    setState(prev => ({
      ...prev,
      activeIntent: null,
      status: 'idle'
    }));
    
    if (mergedOptions.enableLogging && currentIntent) {
      console.log('🧹 Cleared active redirect intent:', createIntentAuditLog(
        'clear',
        currentIntent
      ));
    }
  }, [state.activeIntent, mergedOptions.enableLogging]);
  
  /**
   * Reset the blocked state
   */
  const resetBlockedState = useCallback(() => {
    setState(prev => ({
      ...prev,
      isBlocked: false,
      blockReason: undefined,
      status: 'idle',
      error: undefined
    }));
    
    if (mergedOptions.enableLogging) {
      console.log('🔓 Reset redirect blocked state');
    }
  }, [mergedOptions.enableLogging]);
  
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

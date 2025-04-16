import { useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { 
  RedirectIntentState, 
  RedirectIntent 
} from '../types';
import {
  validateIntent,
  createIntentAuditLog
} from '../utils';
import { clearPersistedIntent } from '../utils/storage';

/**
 * Hook that provides redirect action functions
 */
export function useRedirectActions(
  state: RedirectIntentState,
  setState: React.Dispatch<React.SetStateAction<RedirectIntentState>>,
  redirectTimeoutRef: React.MutableRefObject<number | null>,
  navigationLockRef: React.MutableRefObject<boolean>,
  navigate: NavigateFunction,
  enableLogging: boolean = true
) {
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
  }, [state.activeIntent, setState, redirectTimeoutRef]);
  
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
    
    if (enableLogging) {
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
    enableLogging,
    cancelRedirect,
    setState,
    navigationLockRef
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
    
    if (enableLogging && currentIntent) {
      console.log('🧹 Cleared active redirect intent:', createIntentAuditLog(
        'clear',
        currentIntent
      ));
    }
  }, [state.activeIntent, enableLogging, setState]);
  
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
    
    if (enableLogging) {
      console.log('🔓 Reset redirect blocked state');
    }
  }, [enableLogging, setState]);

  return {
    cancelRedirect,
    executeRedirect,
    clearIntent,
    resetBlockedState
  };
}

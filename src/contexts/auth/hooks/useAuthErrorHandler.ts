
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleApiError, ApiErrorOptions } from '@/lib/handleApiError';
import { useRedirectIntentManager } from '@/lib/redirect-intent';
import { useNavigate } from 'react-router-dom';

interface AuthErrorHandlerOptions {
  /**
   * Should the user be redirected to login on auth errors
   */
  redirectOnAuthError?: boolean;
  
  /**
   * Default error message if none is provided
   */
  defaultErrorMessage?: string;
}

/**
 * Hook for handling auth-related errors with consistent behavior
 */
export function useAuthErrorHandler(options: AuthErrorHandlerOptions = {}) {
  const {
    redirectOnAuthError = false,
    defaultErrorMessage = 'An authentication error occurred'
  } = options;
  
  const { captureIntent } = useRedirectIntentManager({ enableLogging: true });
  const navigate = useNavigate();
  
  /**
   * Handle authentication errors with optional redirect
   */
  const handleAuthError = useCallback((error: unknown, handlerOptions: Partial<ApiErrorOptions> = {}) => {
    const errorObj = handleApiError(error, {
      context: handlerOptions.context || 'auth',
      showToast: handlerOptions.showToast ?? true,
      fallbackMessage: handlerOptions.fallbackMessage || defaultErrorMessage,
      silent: handlerOptions.silent || false
    });
    
    // Check if we should redirect to login
    if (redirectOnAuthError && (errorObj.status === 401 || errorObj.code === 'UNAUTHORIZED')) {
      console.log('🔐 Auth error detected, redirecting to login');
      
      // Capture current path for redirecting back after login
      captureIntent(
        window.location.pathname + window.location.search,
        'auth-error-redirect',
        { reason: errorObj.message },
        3 // High priority
      );
      
      navigate('/auth/login', { replace: true });
    }
    
    return errorObj;
  }, [redirectOnAuthError, defaultErrorMessage, captureIntent, navigate]);
  
  /**
   * Show a success toast message for auth operations
   */
  const showAuthSuccess = useCallback((message: string) => {
    toast({
      title: 'Success',
      description: message
    });
  }, []);
  
  return {
    handleAuthError,
    showAuthSuccess
  };
}

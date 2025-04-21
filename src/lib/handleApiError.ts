
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiErrorOptions {
  context?: string;
  showToast?: boolean;
  fallbackMessage?: string;
  silent?: boolean; // Add the silent property
}

export function handleApiError(error: unknown, options: ApiErrorOptions = {}): ApiError {
  const { context = 'general', showToast = false, silent = false, fallbackMessage } = options;
  
  // Log the error with context, unless silent is true
  if (!silent) {
    console.group(`📉 API Error [${context}]`);
    console.error(error);
    console.log('Error handling options:', options);
    if (error instanceof Error) {
      console.log('Stack trace:', error.stack);
    }
    console.groupEnd();
  }
  
  // Create a standardized error object
  let apiError: ApiError;
  
  if (error instanceof Error) {
    apiError = {
      message: error.message || fallbackMessage || 'An error occurred',
      code: 'UNKNOWN_ERROR'
    };
  } else if (typeof error === 'string') {
    apiError = {
      message: error || fallbackMessage || 'An error occurred',
      code: 'STRING_ERROR'
    };
  } else if (error && typeof error === 'object') {
    try {
      const err = error as any;
      apiError = {
        message: err.message || fallbackMessage || 'An unknown error occurred',
        code: err.code || 'OBJECT_ERROR',
        status: err.status,
        details: err.details || err
      };
    } catch (e) {
      apiError = {
        message: fallbackMessage || 'An unknown error occurred',
        code: 'OBJECT_PARSE_ERROR'
      };
    }
  } else {
    apiError = {
      message: fallbackMessage || 'An unknown error occurred',
      code: 'UNKNOWN_ERROR'
    };
  }
  
  // Show toast if requested and not silent
  if (showToast && !silent) {
    console.log('📣 Showing toast with error:', apiError.message);
    // In a real implementation, this would display a toast
    try {
      const { toast } = require("@/hooks/use-toast");
      toast({
        variant: "destructive",
        title: `Error ${context ? `(${context})` : ''}`,
        description: apiError.message
      });
    } catch (toastError) {
      console.error('📣 Failed to show toast:', toastError);
    }
  }
  
  return apiError;
}

// Functions for showing notifications
export function showSuccess(message: string) {
  console.log('📣 Success:', message);
  try {
    const { toast } = require("@/hooks/use-toast");
    toast({
      title: "Success",
      description: message,
    });
  } catch (e) {
    console.error('Failed to show success toast:', e);
  }
}

export function showInfo(message: string) {
  console.log('📣 Info:', message);
  try {
    const { toast } = require("@/hooks/use-toast");
    toast({
      title: "Information",
      description: message,
    });
  } catch (e) {
    console.error('Failed to show info toast:', e);
  }
}

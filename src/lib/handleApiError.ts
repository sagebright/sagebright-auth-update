
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR'
    };
  }
  
  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR'
  };
}

// Add missing functions referenced elsewhere
export function showSuccess(message: string) {
  console.log('Success:', message);
  // In a real implementation, this would display a toast or notification
}

export function showInfo(message: string) {
  console.log('Info:', message);
  // In a real implementation, this would display a toast or notification
}

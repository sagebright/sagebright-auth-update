
import { useState, useCallback } from "react";

interface UseLoadingOptions {
  initialState?: boolean;
  onStart?: () => void;
  onFinish?: () => void;
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { initialState = false, onStart, onFinish } = options;
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    onStart?.();
  }, [onStart]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    onFinish?.();
  }, [onFinish]);

  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      try {
        startLoading();
        const result = await promise;
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

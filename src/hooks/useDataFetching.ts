
import { useQuery, useMutation, UseQueryResult, UseMutationResult, QueryClient, QueryKey } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth/AuthContext';
import { handleApiError } from '@/lib/handleApiError';
import { useToast } from './use-toast';

interface DataFetchingOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number | boolean;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface MutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: any, error: Error | null) => void;
  invalidateQueries?: QueryKey[];
}

/**
 * Hook to standardize data fetching with React Query
 * Automatically handles authentication and loading states
 */
export function useDataFetching<T>(
  queryKey: QueryKey,
  fetchFn: () => Promise<T>,
  options: DataFetchingOptions = {}
): UseQueryResult<T, Error> & { isAuthenticated: boolean } {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user && !authLoading;
  
  const query = useQuery({
    queryKey,
    queryFn: fetchFn,
    enabled: isAuthenticated && (options.enabled !== false),
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    staleTime: options.staleTime,
    gcTime: options.cacheTime,
    retry: options.retry,
    retryDelay: options.retryDelay,
    meta: {
      onSuccess: options.onSuccess,
      onError: (error: Error) => {
        handleApiError(error, {
          context: `fetching ${queryKey.join('.')}`,
          showToast: true
        });
        if (options.onError) options.onError(error);
      }
    }
  });

  return { ...query, isAuthenticated };
}

/**
 * Hook to standardize data mutation with React Query
 * Automatically handles authentication and loading states
 */
export function useDataMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: MutationOptions = {}
): UseMutationResult<T, Error, V> & { isAuthenticated: boolean } {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user && !authLoading;
  const { toast } = useToast();
  const queryClient = new QueryClient();
  
  const mutation = useMutation({
    mutationFn,
    meta: {
      onSuccess: (data: T) => {
        if (options.onSuccess) options.onSuccess(data);
        if (options.invalidateQueries && options.invalidateQueries.length > 0) {
          options.invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey });
          });
        }
      },
      onError: (error: Error) => {
        handleApiError(error, {
          context: 'mutation error',
          showToast: true
        });
        if (options.onError) options.onError(error);
      },
      onSettled: (data: T, error: Error | null) => {
        if (options.onSettled) options.onSettled(data, error);
      }
    }
  });

  return { ...mutation, isAuthenticated };
}

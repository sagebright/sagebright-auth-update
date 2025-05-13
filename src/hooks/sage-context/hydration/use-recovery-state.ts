
import { useOrgRecovery } from '@/hooks/use-org-recovery';
import { OrgRecoveryState } from './types';

/**
 * Hook to track organization recovery state with proper TypeScript typing
 */
export function useRecoveryState(
  userId: string | null,
  orgId: string | null,
  isAuthenticated: boolean
): OrgRecoveryState {
  return useOrgRecovery(userId, orgId, isAuthenticated);
}

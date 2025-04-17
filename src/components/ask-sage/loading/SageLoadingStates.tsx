
import React from 'react';
import { LoadingSage } from '@/components/ask-sage/LoadingSage';
import { LoadingUI } from '@/components/ask-sage/LoadingUI';
import { AuthRequiredUI } from '@/components/ask-sage/AuthRequiredUI';
import { OrgRecoveryUI } from '@/components/ask-sage/OrgRecoveryUI';
import { HydrationUI } from '@/components/ask-sage/HydrationUI';

interface SageLoadingStatesProps {
  authLoading: boolean;
  userId: string | null;
  orgId: string | null;
  isProtected: boolean;
  canInteract: boolean;
  isRecoveringOrg: boolean;
  contextHydration: any;
  shouldRender: boolean;
}

export const SageLoadingStates: React.FC<SageLoadingStatesProps> = ({
  authLoading,
  userId,
  orgId,
  isProtected,
  canInteract,
  isRecoveringOrg,
  contextHydration,
  shouldRender
}) => {
  // Determine appropriate loading UI based on hydration state
  const renderLoadingState = () => {
    // If under protection, show simplified loading state
    if (isProtected) {
      return <LoadingSage reason="initialization" />;
    }
    
    // If not interactive, show hydration UI with progress
    if (!canInteract) {
      return (
        <HydrationUI 
          isLoading={true}
          progress={contextHydration.hydration.progressPercent}
          blockers={contextHydration.blockers}
          blockersByCategory={contextHydration.blockersByCategory}
          completedSteps={contextHydration.hydration.completedSteps}
        />
      );
    }
    
    // Fallback for unexpected states
    return <LoadingSage reason="context_loading" />;
  };

  // Not ready to render
  if (!shouldRender) {
    return renderLoadingState();
  }

  // Authentication flow
  if (authLoading) return <LoadingUI />;
  if (!authLoading && !userId) return <AuthRequiredUI />;
  if (!authLoading && userId && !orgId && !isRecoveringOrg) return <OrgRecoveryUI />;

  // If we got here, we're ready to render the actual content
  return null;
};


import React, { useState, useEffect } from 'react';
import { LoadingSage } from '@/components/ask-sage/LoadingSage';
import { LoadingUI } from '@/components/ask-sage/LoadingUI';
import { AuthRequiredUI } from '@/components/ask-sage/AuthRequiredUI';
import { OrgRecoveryUI } from '@/components/ask-sage/OrgRecoveryUI';
import { HydrationUI } from '@/components/ask-sage/HydrationUI';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
  // Track loading time for timeout detection
  const [loadStartTime] = useState<number>(Date.now());
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  
  // Constants
  const LOADING_TIMEOUT_MS = 12000; // 12 seconds before showing failsafe UI
  
  // Check if loading has exceeded the timeout threshold
  useEffect(() => {
    // Don't start timeout if already rendered or no user ID (not logged in yet)
    if (shouldRender || !userId) return;
    
    const timeoutId = setTimeout(() => {
      setIsTimedOut(true);
      console.warn('⚠️ Context loading timeout exceeded', {
        elapsed: Date.now() - loadStartTime,
        hydrationProgress: contextHydration?.hydration?.progressPercent || 0,
        blockers: contextHydration?.blockers || [],
        blockersByCategory: contextHydration?.blockersByCategory || {}
      });
    }, LOADING_TIMEOUT_MS);
    
    return () => clearTimeout(timeoutId);
  }, [shouldRender, userId, loadStartTime, contextHydration]);

  // Handle manual retry attempt
  const handleRetry = () => {
    // Log the retry attempt with diagnostic information
    console.log('🔄 Manual retry triggered by user', {
      timestamp: new Date().toISOString(),
      userId,
      orgId,
      blockers: contextHydration?.blockers || []
    });
    
    toast({
      title: "Retrying connection...",
      description: "Refreshing context data."
    });
    
    // Reset timeout state
    setIsTimedOut(false);
    
    // Force a page refresh to restart the context loading process
    window.location.reload();
  };
  
  // Render timeout fallback UI when loading stalls
  const renderTimeoutFallback = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 max-w-md mx-auto text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Loading is taking longer than expected</h3>
        <p className="text-muted-foreground mb-6">
          The system is still trying to load your context data. This could be due to network issues or a temporary service delay.
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowDiagnostics(!showDiagnostics)}
          >
            {showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics'}
          </Button>
        </div>
        
        {showDiagnostics && (
          <div className="mt-6 p-4 bg-muted/30 rounded-md text-left text-xs overflow-auto max-h-96 w-full">
            <h4 className="font-medium mb-2">Loading Diagnostics</h4>
            <div className="space-y-2">
              <p>Progress: {contextHydration?.hydration?.progressPercent || 0}%</p>
              <p>Elapsed: {Math.round((Date.now() - loadStartTime) / 1000)}s</p>
              
              {contextHydration?.blockers?.length > 0 && (
                <>
                  <p className="font-medium mt-2">Active Blockers:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {contextHydration.blockers.map((blocker: string, i: number) => (
                      <li key={i} className="text-amber-600">{blocker}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {contextHydration?.blockersByCategory && (
                <div className="mt-2">
                  <p className="font-medium">Blocker Categories:</p>
                  {Object.entries(contextHydration.blockersByCategory).map(([category, blockers]: [string, any]) => (
                    <div key={category} className="mt-1">
                      <p className="text-muted-foreground">{category}:</p>
                      {Array.isArray(blockers) && blockers.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {blockers.map((blocker: string, i: number) => (
                            <li key={i}>{blocker}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No specific blockers</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Determine appropriate loading UI based on hydration state
  const renderLoadingState = () => {
    // If loading has timed out, show the timeout fallback UI
    if (isTimedOut && userId) {
      return renderTimeoutFallback();
    }
    
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

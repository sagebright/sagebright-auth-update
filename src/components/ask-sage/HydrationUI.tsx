
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface HydrationUIProps {
  isLoading: boolean;
  progress: number;
  blockers: string[];
  blockersByCategory?: Record<string, string[]>;
  completedSteps?: string[];
}

export const HydrationUI: React.FC<HydrationUIProps> = ({
  isLoading,
  progress,
  blockers,
  blockersByCategory = {},
  completedSteps = []
}) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-6">
      <div className="max-w-md w-full">
        <div className="animate-pulse h-16 w-16 border-4 border-primary border-t-transparent rounded-full mb-6 mx-auto"></div>
        
        <h1 className="text-2xl font-semibold text-center mb-2">
          Loading Sage
        </h1>
        
        <p className="text-muted-foreground text-center mb-6">
          Setting up your personalized assistant
        </p>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <p className="text-sm text-center text-muted-foreground">
            {progress}% complete
          </p>
          
          {/* Show component states in development mode */}
          {isDev && (
            <div className="mt-6 border rounded-lg p-4 bg-background/50">
              <h3 className="text-sm font-medium mb-2">Initialization Status</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Authentication</span>
                  <span className={completedSteps.includes('auth') ? 'text-green-500' : 'text-amber-500'}>
                    {completedSteps.includes('auth') ? '✓ Ready' : '⋯ Loading'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Session</span>
                  <span className={completedSteps.includes('session') ? 'text-green-500' : 'text-amber-500'}>
                    {completedSteps.includes('session') ? '✓ Ready' : '⋯ Loading'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Organization</span>
                  <span className={completedSteps.includes('org') ? 'text-green-500' : 'text-amber-500'}>
                    {completedSteps.includes('org') ? '✓ Ready' : '⋯ Loading'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Voice</span>
                  <span className={completedSteps.includes('voice') ? 'text-green-500' : 'text-amber-500'}>
                    {completedSteps.includes('voice') ? '✓ Ready' : '⋯ Loading'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Backend Context</span>
                  <span className={completedSteps.includes('backend') ? 'text-green-500' : 'text-amber-500'}>
                    {completedSteps.includes('backend') ? '✓ Ready' : '⋯ Loading'}
                  </span>
                </div>
              </div>
              
              {/* Only show blockers if there are any */}
              {blockers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-xs font-medium mb-1 text-red-500">Active Blockers</h4>
                  <ul className="space-y-1">
                    {blockers.map((blocker, index) => (
                      <li key={index} className="text-xs text-red-500">
                        • {blocker}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

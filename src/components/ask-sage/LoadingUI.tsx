
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface LoadingUIProps {
  state?: any;
}

export const LoadingUI: React.FC<LoadingUIProps> = ({ state }) => {
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
        
        <Progress value={state?.hydration?.progressPercent || 0} className="h-2" />
      </div>
    </div>
  );
};

// Add default export for backward compatibility
export default LoadingUI;

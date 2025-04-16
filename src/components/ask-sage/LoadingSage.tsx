
import React from 'react';

interface LoadingSageProps {
  reason?: string;  // Make this optional so existing code doesn't break
}

export const LoadingSage: React.FC<LoadingSageProps> = ({ reason = 'general' }) => {
  // Customize message based on reason
  const getMessage = () => {
    switch (reason) {
      case 'initialization':
        return 'Setting up your environment...';
      case 'context_loading':
        return 'Loading your personalized context...';
      default:
        return 'Preparing your personalized experience';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <p className="text-lg text-primary">Sage is waking up...</p>
      <p className="text-sm text-muted-foreground mt-2">{getMessage()}</p>
    </div>
  );
};

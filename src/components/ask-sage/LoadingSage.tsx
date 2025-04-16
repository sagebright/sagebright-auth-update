
import React from 'react';

export const LoadingSage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <p className="text-lg text-primary">Sage is waking up...</p>
      <p className="text-sm text-muted-foreground mt-2">Preparing your personalized experience</p>
    </div>
  );
};

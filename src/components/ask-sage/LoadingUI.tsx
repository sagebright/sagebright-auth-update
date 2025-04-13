
import React from 'react';

interface LoadingUIProps {
  message?: string;
}

export const LoadingUI: React.FC<LoadingUIProps> = ({ message = "Checking authentication..." }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-2 text-primary">{message}</span>
    </div>
  );
};

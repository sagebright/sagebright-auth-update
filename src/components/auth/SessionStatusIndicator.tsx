
import React from "react";

interface SessionStatusIndicatorProps {
  loading: boolean;
}

const SessionStatusIndicator: React.FC<SessionStatusIndicatorProps> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div className="flex items-center mb-4">
      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-2 text-primary text-sm">Checking session…</span>
    </div>
  );
};

export default SessionStatusIndicator;

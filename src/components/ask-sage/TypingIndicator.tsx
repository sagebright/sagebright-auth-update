
import React from 'react';
import { Loader2 } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex flex-col max-w-[75%]">
        <div className="bg-sagebright-green text-white px-4 py-3 rounded-lg shadow-sm flex items-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sage is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

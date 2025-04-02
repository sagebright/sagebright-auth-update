
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2 justify-start">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src="/lovable-uploads/sage_avatar.png" alt="Sage avatar" />
        <AvatarFallback className="bg-sagebright-green text-white text-xs">
          S
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col max-w-[75%]">
        <div className="bg-sagebright-green text-white px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <span className="typing-dots flex space-x-1">
              <span className="dot w-2 h-2 bg-white rounded-full opacity-75 animate-pulse"></span>
              <span className="dot w-2 h-2 bg-white rounded-full opacity-75 animate-pulse delay-150"></span>
              <span className="dot w-2 h-2 bg-white rounded-full opacity-75 animate-pulse delay-300"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

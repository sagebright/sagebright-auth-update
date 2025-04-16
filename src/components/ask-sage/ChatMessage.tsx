
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'sage';
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
  avatar_url?: string;
}

interface ChatMessageProps {
  message: Message;
  handleFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, handleFeedback }) => {
  // Get initials for avatar fallback
  const getInitials = () => {
    return message.sender === 'sage' 
      ? 'S' 
      : 'U'; // Default user initial if no other info available
  };

  // Set avatar URL based on sender
  const avatarUrl = message.sender === 'sage' 
    ? "/lovable-uploads/sage_avatar.png" 
    : message.avatar_url;
    
  // Safe date formatting with robust error handling
  const formatTimestamp = (timestamp: Date | null | undefined) => {
    try {
      if (!timestamp) {
        return "";
      }
      
      // For string timestamps, try to convert to Date
      const dateObj = timestamp instanceof Date ? timestamp : new Date(timestamp);
      
      // Validate that the date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn("🛑 Invalid date passed to formatter:", timestamp);
        return "";
      }
      
      return format(dateObj, 'h:mm a');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'sage' && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt="Sage avatar" />
          <AvatarFallback className="bg-sagebright-green text-white text-xs">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col max-w-[75%]">
        <div 
          className={`${
            message.sender === 'user' 
              ? 'bg-sagebright-accent text-charcoal ml-4' 
              : 'bg-sagebright-green text-white mr-4'
          } px-4 py-3 rounded-lg shadow-sm`}
        >
          {message.content}
        </div>
        <div className="flex items-center mt-1 px-1">
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.sender === 'sage' && handleFeedback && (
            <div className="flex ml-2">
              <button 
                onClick={() => handleFeedback(message.id, 'like')}
                className={`p-1 rounded-full hover:bg-gray-100 ${message.liked ? 'text-sagebright-green' : 'text-gray-400'}`}
              >
                <ThumbsUp size={14} />
              </button>
              <button 
                onClick={() => handleFeedback(message.id, 'dislike')}
                className={`p-1 rounded-full hover:bg-gray-100 ${message.disliked ? 'text-bittersweet' : 'text-gray-400'}`}
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {message.sender === 'user' && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt="User avatar" />
          <AvatarFallback className="bg-sagebright-accent text-charcoal text-xs">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

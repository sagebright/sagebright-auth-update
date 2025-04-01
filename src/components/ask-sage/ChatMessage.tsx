
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';

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
  onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onFeedback }) => {
  return (
    <div className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'sage' && message.avatar_url && (
        <img
          src={message.avatar_url}
          alt="Sage avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
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
        {format(message.timestamp, 'h:mm a')}
      </span>
      {message.sender === 'sage' && (
        <div className="flex ml-2">
          <button 
            onClick={() => onFeedback(message.id, 'like')}
            className={`p-1 rounded-full hover:bg-gray-100 ${message.liked ? 'text-sagebright-green' : 'text-gray-400'}`}
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            onClick={() => onFeedback(message.id, 'dislike')}
            className={`p-1 rounded-full hover:bg-gray-100 ${message.disliked ? 'text-bittersweet' : 'text-gray-400'}`}
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      )}
    </div>
  </div>
</div>
  );
};

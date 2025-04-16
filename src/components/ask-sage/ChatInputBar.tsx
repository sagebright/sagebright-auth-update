
import React, { useState } from 'react';
import { ReflectionData } from './ReflectionForm';

interface ChatInputBarProps {
  onSendMessage: (content: string) => void;
  onReflectionSubmit: (data: ReflectionData) => void;
  isLoading: boolean;
  suggestedQuestions: string[];
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  onReflectionSubmit,
  isLoading,
  suggestedQuestions,
  onSelectQuestion,
  disabled = false
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  // For demo purposes, we can simulate submitting a reflection
  const handleReflectionClick = () => {
    // This is a mock reflection data, in a real app this would come from a form
    const mockReflectionData: ReflectionData = {
      wellResponse: "I've learned a lot about the company structure",
      unclearResponse: "I'm still confused about the benefits package",
      shareWithManager: false
    };
    onReflectionSubmit(mockReflectionData);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Sage a question..."
          className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading || disabled}
        />
        <button
          type="submit"
          className={`bg-primary text-white px-4 py-2 rounded-r-md ${
            (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
          disabled={isLoading || disabled}
        >
          Send
        </button>
      </form>
      
      {/* This button would typically be elsewhere in the UI */}
      {/* 
      <button 
        onClick={handleReflectionClick}
        className="mt-2 text-sm text-gray-500 hover:text-primary"
        disabled={disabled}
      >
        Reflect on your experience
      </button>
      */}
    </div>
  );
};

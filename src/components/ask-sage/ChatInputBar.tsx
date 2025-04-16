
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useDebugPanel } from '@/hooks/use-debug-panel';

interface ChatInputBarProps {
  onSendMessage: (content: string) => void;
  onReflectionSubmit?: () => void;
  isLoading?: boolean;
  suggestedQuestions?: string[];
  onSelectQuestion?: (question: string) => void;
  disabled?: boolean; // Added disabled prop
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ 
  onSendMessage, 
  onReflectionSubmit, 
  isLoading = false,
  suggestedQuestions = [],
  onSelectQuestion,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debugPanel = useDebugPanel();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim() || isLoading || disabled) return;
    
    try {
      onSendMessage(message.trim());
      setMessage('');
      setShowSuggestions(false);
      
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectSuggestion = (question: string) => {
    if (onSelectQuestion) {
      onSelectQuestion(question);
    } else {
      setMessage(question);
      // Auto-submit after a short delay to make it feel natural
      setTimeout(() => {
        onSendMessage(question);
      }, 300);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-sagebright-green focus:border-transparent"
              placeholder={disabled ? "Please wait while Sage is loading..." : "Ask Sage a question..."}
              rows={1}
              disabled={isLoading || disabled}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <Button 
            type="submit" 
            className="bg-sagebright-green hover:bg-sagebright-green/90 text-white font-medium py-2 px-4 rounded-lg flex items-center"
            disabled={!message.trim() || isLoading || disabled}
          >
            <Send size={18} className="mr-2" />
            Send
          </Button>
        </form>
        
        {/* Suggested questions chips */}
        {suggestedQuestions.length > 0 && !isLoading && message === '' && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(question)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded-full"
                disabled={disabled}
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

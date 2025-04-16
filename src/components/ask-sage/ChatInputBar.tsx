
import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';

interface ChatInputBarProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  placeholder?: string;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSend,
  isLoading = false,
  disabled = false,
  disabledReason,
  placeholder = "Ask Sage a question..."
}) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex items-end gap-2">
      <div className="relative flex-1">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled && disabledReason ? disabledReason : placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[40px] max-h-[120px] bg-background"
          style={{ overflowY: 'auto' }}
        />
      </div>
      
      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={!message.trim() || isLoading || disabled}
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

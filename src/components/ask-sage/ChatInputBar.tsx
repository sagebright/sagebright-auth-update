import React, { useState, KeyboardEvent, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';

interface ChatInputBarProps {
  onSend?: (message: string) => void;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (content: string) => void;
  onFormSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  placeholder?: string;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSend,
  onSubmit,
  value,
  onChange,
  onFormSubmit,
  isLoading = false,
  disabled = false,
  disabledReason,
  placeholder = "Ask Sage a question..."
}) => {
  // Use controlled state if value/onChange are not provided
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    const currentMessage = value !== undefined ? value : message;
    if (currentMessage.trim() && !isLoading && !disabled) {
      if (onSend) onSend(currentMessage.trim());
      if (onSubmit) onSubmit(currentMessage.trim());
      
      // Only clear internal state if not controlled externally
      if (value === undefined) {
        setMessage('');
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleFormSubmitInternal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit(e);
    } else {
      handleSend();
    }
  };
  
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // If externally controlled, use provided onChange
    if (onChange) {
      // Convert to expected type since we're using textarea instead of input
      const inputEvent = e as unknown as ChangeEvent<HTMLInputElement>;
      onChange(inputEvent);
    } else {
      // Otherwise use internal state
      setMessage(e.target.value);
    }
  };
  
  return (
    <form onSubmit={handleFormSubmitInternal} className="flex items-end gap-2">
      <div className="relative flex-1">
        <textarea
          value={value !== undefined ? value : message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled && disabledReason ? disabledReason : placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[40px] max-h-[120px] bg-background"
          style={{ overflowY: 'auto' }}
        />
      </div>
      
      <Button
        type="submit"
        size="icon"
        disabled={(value !== undefined ? !value.trim() : !message.trim()) || isLoading || disabled}
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

// Add default export for backward compatibility
export default ChatInputBar;

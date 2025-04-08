
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic } from 'lucide-react';

interface ConversationInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  showAttachments?: boolean;
  showVoice?: boolean;
}

export function ConversationInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  autoFocus = true,
  className,
  showAttachments = true,
  showVoice = true,
}: ConversationInputProps) {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn(
      "flex flex-col gap-2 bg-background p-3 border-t border-border rounded-lg shadow-sm", 
      className
    )}>
      <div className="flex w-full items-end gap-2">
        {showAttachments && (
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 shrink-0 rounded-full"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
        )}
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className="min-h-9 resize-none text-base md:text-sm"
          rows={1}
        />
        
        {showVoice && (
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 shrink-0 rounded-full"
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice message</span>
          </Button>
        )}
        
        <Button 
          type="button"
          size="icon" 
          disabled={!message.trim() || disabled}
          className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}

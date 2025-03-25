
import React, { useState } from 'react';
import { MessageCircle, Search, CircleDot, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReflectionForm, ReflectionData } from './ReflectionForm';
import { SuggestedQuestions } from './SuggestedQuestions';

interface ChatInputBarProps {
  onSendMessage: (content: string) => void;
  onReflectionSubmit: (data: ReflectionData) => void;
  isLoading?: boolean;
  suggestedQuestions: string[];
  onSelectQuestion: (question: string) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ 
  onSendMessage, 
  onReflectionSubmit,
  isLoading = false,
  suggestedQuestions,
  onSelectQuestion
}) => {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleReflectionSubmit = (data: ReflectionData) => {
    onReflectionSubmit(data);
    setActiveTab('chat');
  };

  const handleReflectionCancel = () => {
    setActiveTab('chat');
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-3xl mx-auto">
        <Tabs 
          defaultValue="chat" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-2">
            <TabsTrigger value="chat" className="flex items-center">
              <MessageCircle size={16} className="mr-1" />
              Ask Sage
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center">
              <Search size={16} className="mr-1" />
              Search
            </TabsTrigger>
            <TabsTrigger value="reflect" className="flex items-center">
              <CircleDot size={16} className="mr-1" />
              Reflect
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex flex-col space-y-4 mt-0">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 min-h-[80px] resize-none pr-14"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading) handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={handleSendMessage}
                  className={`rounded-full p-2 flex items-center justify-center transition-all ${
                    inputValue.trim() && !isLoading
                      ? "bg-sagebright-green hover:bg-sagebright-green/90" 
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                >
                  <ArrowUp 
                    size={18} 
                    className={`${
                      inputValue.trim() && !isLoading 
                        ? "text-white" 
                        : "text-gray-400"
                    }`} 
                  />
                </button>
              </div>
            </div>
            
            {/* Suggested Questions section */}
            <SuggestedQuestions 
              questions={suggestedQuestions}
              onSelectQuestion={onSelectQuestion}
            />
          </TabsContent>
          
          <TabsContent value="search" className="flex space-x-2 mt-0">
            <Input
              placeholder="Search resources, policies, and more..."
              className="flex-1"
            />
            <Button>Search</Button>
          </TabsContent>
          
          <TabsContent value="reflect" className="mt-0">
            <ReflectionForm 
              onSubmit={handleReflectionSubmit}
              onCancel={handleReflectionCancel}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

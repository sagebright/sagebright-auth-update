
import React, { useState } from 'react';
import { MessageCircle, Search, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReflectionForm, ReflectionData } from './ReflectionForm';

interface ChatInputBarProps {
  onSendMessage: (content: string) => void;
  onReflectionSubmit: (data: ReflectionData) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ 
  onSendMessage, 
  onReflectionSubmit 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
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
          
          <TabsContent value="chat" className="flex space-x-2 mt-0">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-sagebright-green hover:bg-sagebright-green/90"
            >
              Send
            </Button>
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

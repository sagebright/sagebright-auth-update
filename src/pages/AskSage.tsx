
import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Search, MessageCircle, CircleDot, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Define the message type
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'sage';
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
}

// Common onboarding questions
const suggestedQuestions = [
  "What should I focus on this week?",
  "Where do I find our PTO policy?",
  "Who do I talk to about benefits?",
  "How do I set up my development environment?",
  "What's the process for requesting equipment?"
];

// Recently viewed answers
const recentlyViewed = [
  "Company holiday schedule",
  "401k enrollment process",
  "Team structure and reporting lines",
  "Health insurance comparison",
];

const AskSage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Add initial greeting from Sage if empty chat
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: "Hey there — I'm Sage. I'm here to help you settle in, answer questions, and check in when things feel unclear or overwhelming. Just type anything below and I'll take it from there.",
          sender: 'sage',
          timestamp: new Date(),
        }
      ]);
    }
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Randomly prompt for reflection after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 1 && !showReflection && Math.random() > 0.7) {
        setShowReflection(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [messages, showReflection]);

  const handleSendMessage = (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate Sage response
    setTimeout(() => {
      const sageResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getSageResponse(content),
        sender: 'sage',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, sageResponse]);
    }, 1000);
  };

  const getSageResponse = (query: string): string => {
    // Simple response generator for demonstration
    if (query.toLowerCase().includes('pto') || query.toLowerCase().includes('time off')) {
      return "Great question! PTO policies can be found in the Employee Handbook under Benefits (Section 3.2). The basics: you have 15 days annually, accrued monthly. Your manager needs at least 2 weeks notice for extended time off. Need more details?";
    }
    
    if (query.toLowerCase().includes('benefit') || query.toLowerCase().includes('insurance')) {
      return "For benefits questions, Kim from HR is your go-to person! She holds office hours Tuesdays and Thursdays from 1-3pm. The benefits portal can be accessed through your employee dashboard. Would you like me to send you a direct link?";
    }
    
    if (query.toLowerCase().includes('focus') || query.toLowerCase().includes('this week')) {
      return "Based on your onboarding plan, this week you should focus on: 1) Completing your security training, 2) Setting up 1:1s with your team members, and 3) Reviewing the Q3 product roadmap. How's that sound?";
    }
    
    return "That's a great question! I'll help you find the answer. Based on your role and team, here's what I'd recommend: reach out to your team lead or check the department resources in the knowledge base. Would you like me to point you to specific documentation?";
  };

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          liked: feedback === 'like' ? true : false,
          disliked: feedback === 'dislike' ? true : false,
        };
      }
      return message;
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Top Greeting Card (optional sticky) */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src="/lovable-uploads/sage_avatar.png" alt="Sage" />
              </Avatar>
              <div>
                <h1 className="text-xl font-helvetica font-medium text-charcoal">Ask Sage</h1>
                <p className="text-sm text-gray-500">Your personal onboarding assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="hidden md:flex">
                {sidebarOpen ? <ChevronRight className="mr-1" /> : <ChevronLeft className="mr-1" />}
                {sidebarOpen ? "Hide" : "Resources"}
              </Button>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <ChevronLeft className="mr-1" />
                  Resources
                </Button>
              </SheetTrigger>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Main Chat Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
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
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <p>Start a conversation with Sage</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              {/* Suggested Questions (if chat is relatively empty) */}
              {messages.length < 3 && (
                <div className="max-w-3xl mx-auto mt-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Common questions:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button 
                        key={index} 
                        variant="outline"
                        className="justify-start h-auto py-3 px-4 text-left hover:bg-gray-50 border-gray-200"
                        onClick={() => handleSendMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Bar (Sticky at Bottom) */}
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
                      onClick={() => handleSendMessage()}
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
                      onSubmit={() => setActiveTab('chat')}
                      onCancel={() => setActiveTab('chat')}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Sidebar (Desktop) */}
          {sidebarOpen && (
            <div className="hidden md:flex flex-col w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
              <ResourcesSidebar />
            </div>
          )}
        </div>
        
        {/* Reflection Modal */}
        <Dialog open={showReflection} onOpenChange={setShowReflection}>
          <DialogContent className={isMobile ? "w-full h-[90vh] rounded-t-lg p-4 max-w-full pt-6" : ""}>
            <DialogHeader>
              <DialogTitle className="text-xl font-helvetica text-charcoal">Want to check in with yourself?</DialogTitle>
              <DialogDescription>
                Taking a moment to reflect can help your onboarding journey.
              </DialogDescription>
            </DialogHeader>
            <ReflectionForm 
              onSubmit={() => setShowReflection(false)}
              onCancel={() => setShowReflection(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Mobile Sheet for Resources Sidebar */}
        <Sheet>
          <SheetContent side="left" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Resources & History</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <ResourcesSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
};

// Reflection Form Component
const ReflectionForm = ({ onSubmit, onCancel }: { onSubmit: () => void, onCancel: () => void }) => {
  const [wellResponse, setWellResponse] = useState('');
  const [unclearResponse, setUnclearResponse] = useState('');
  const [shareWithManager, setShareWithManager] = useState(false);
  
  const handleSubmit = () => {
    // Process reflection responses here
    console.log({
      wellResponse,
      unclearResponse,
      shareWithManager
    });
    onSubmit();
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="well-response" className="block text-sm font-medium text-charcoal mb-1">
          What's one thing that's gone well this week?
        </label>
        <Textarea
          id="well-response"
          value={wellResponse}
          onChange={(e) => setWellResponse(e.target.value)}
          placeholder="I feel like I've made progress with..."
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="unclear-response" className="block text-sm font-medium text-charcoal mb-1">
          Is anything feeling unclear?
        </label>
        <Textarea
          id="unclear-response"
          value={unclearResponse}
          onChange={(e) => setUnclearResponse(e.target.value)}
          placeholder="I'm still trying to understand..."
          className="w-full"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="share-manager"
          checked={shareWithManager}
          onChange={(e) => setShareWithManager(e.target.checked)}
          className="h-4 w-4 text-sagebright-green rounded border-gray-300 focus:ring-sagebright-green"
        />
        <label htmlFor="share-manager" className="ml-2 block text-sm text-gray-700">
          Would you like to share this with your manager?
        </label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-sagebright-gold hover:bg-sagebright-gold/90 text-charcoal"
        >
          Save Reflection
        </Button>
      </div>
    </div>
  );
};

// Resources Sidebar Component
const ResourcesSidebar = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-charcoal mb-3">Recently Viewed</h3>
        <div className="space-y-2">
          {recentlyViewed.map((item, index) => (
            <Button 
              key={index} 
              variant="ghost" 
              className="w-full justify-start text-left h-auto py-2"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-charcoal mb-3">Tools & Shortcuts</h3>
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-3 cursor-pointer hover:bg-gray-50 text-center">
            <p className="text-xs font-medium mb-1">HR Portal</p>
          </Card>
          <Card className="p-3 cursor-pointer hover:bg-gray-50 text-center">
            <p className="text-xs font-medium mb-1">IT Help</p>
          </Card>
          <Card className="p-3 cursor-pointer hover:bg-gray-50 text-center">
            <p className="text-xs font-medium mb-1">Knowledge Base</p>
          </Card>
          <Card className="p-3 cursor-pointer hover:bg-gray-50 text-center">
            <p className="text-xs font-medium mb-1">Team Directory</p>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-charcoal mb-2">About Sage</h3>
        <p className="text-sm text-gray-600">
          Sage is your private onboarding assistant. Your conversations remain 
          confidential unless you choose to share them.
        </p>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm border border-gray-200">
          <p className="text-charcoal/80 font-medium mb-1">Privacy Promise</p>
          <p className="text-gray-600 text-xs">
            Sage only shares what you explicitly approve. Your reflections and questions
            help us improve onboarding for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AskSage;

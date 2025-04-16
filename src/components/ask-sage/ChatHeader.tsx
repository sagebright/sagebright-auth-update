
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ResourcesSidebar } from './ResourcesSidebar';

interface ChatHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isProtected?: boolean; // Added optional isProtected prop
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen,
  isProtected = false // Default to false
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src="/lovable-uploads/sage_avatar.png" alt="Sage" />
          </Avatar>
          <div>
            <h1 className="text-xl font-helvetica font-medium text-charcoal">Ask Sage</h1>
            <p className="text-sm text-gray-500">Answers that help you move forward</p>
            {isProtected && (
              <span className="text-xs text-primary">🛡️ Protection active</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="hidden md:flex"
          >
            {sidebarOpen ? <ChevronRight className="mr-1" /> : <ChevronLeft className="mr-1" />}
            {sidebarOpen ? "Hide" : "Resources"}
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <ChevronLeft className="mr-1" />
                Resources
              </Button>
            </SheetTrigger>
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
      </div>
    </div>
  );
};


import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface SectionWrapperProps {
  title: string;
  description: string;
  id?: string;
  children: React.ReactNode;
}

export function SectionWrapper({ title, description, id, children }: SectionWrapperProps) {
  return (
    <div id={id} className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Ask Sage
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Ask Sage about {title}</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <div className="rounded-lg border p-8 flex flex-col items-center justify-center text-center">
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Sage Assistant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  I can help you with {title.toLowerCase()}. What would you like to know?
                </p>
                <div className="space-y-2 w-full">
                  <div className="p-3 bg-muted rounded-md text-sm hover:bg-muted/80 cursor-pointer">
                    How do I add a new {title.toLowerCase().slice(0, -1)}?
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm hover:bg-muted/80 cursor-pointer">
                    What are best practices for {title.toLowerCase()}?
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm hover:bg-muted/80 cursor-pointer">
                    Show me a quick tutorial
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {children}
    </div>
  );
}

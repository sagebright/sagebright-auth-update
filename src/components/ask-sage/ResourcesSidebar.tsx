
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ResourcesSidebarProps {
  recentlyViewed?: string[];
}

export const ResourcesSidebar: React.FC<ResourcesSidebarProps> = ({ 
  recentlyViewed = [
    "Company holiday schedule",
    "401k enrollment process",
    "Team structure and reporting lines",
    "Health insurance comparison",
  ] 
}) => {
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

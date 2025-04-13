
import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AdminTopNavbar() {
  return (
    <div className="w-full h-16 bg-white border-b px-6 flex items-center justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input 
          type="search" 
          placeholder="Search..." 
          className="pl-10 h-9 w-full bg-gray-50 border-gray-200"
        />
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          <span className="mr-2">Last 30 days</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            3
          </span>
        </Button>
        
        <Button variant="default" size="sm">
          New Report
        </Button>
      </div>
    </div>
  );
}

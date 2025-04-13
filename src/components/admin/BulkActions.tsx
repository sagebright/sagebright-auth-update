
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Archive, Trash2, Power } from 'lucide-react';

interface BulkActionsProps {
  selectedItems: string[];
  onSelectAll: () => void;
  allSelected: boolean;
  onClearSelection: () => void;
  totalItems: number;
}

export function BulkActions({
  selectedItems,
  onSelectAll,
  allSelected,
  onClearSelection,
  totalItems,
}: BulkActionsProps) {
  const handleAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    // In a real app, this would trigger an API call or other logic
    onClearSelection();
  };

  if (selectedItems.length === 0) {
    return (
      <div className="flex items-center mb-4">
        <Checkbox
          id="select-all"
          checked={false}
          onCheckedChange={onSelectAll}
        />
        <label htmlFor="select-all" className="ml-2 text-sm text-muted-foreground">
          Select all ({totalItems})
        </label>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-4 p-2 bg-muted/20 rounded-md">
      <div className="flex items-center">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={onSelectAll}
        />
        <label htmlFor="select-all" className="ml-2 text-sm">
          {selectedItems.length} items selected
        </label>
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Cancel
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAction('activate')}>
              <Power className="mr-2 h-4 w-4" /> Activate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('archive')}>
              <Archive className="mr-2 h-4 w-4" /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('delete')} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

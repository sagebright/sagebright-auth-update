
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface QuestionFormTagsProps {
  currentTag: string;
  setCurrentTag: (value: string) => void;
  tags: string[];
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
}

export function QuestionFormTags({
  currentTag,
  setCurrentTag,
  tags,
  handleAddTag,
  handleRemoveTag
}: QuestionFormTagsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags</label>
      <div className="flex gap-2">
        <Input
          placeholder="Add a tag..."
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <Button type="button" variant="outline" onClick={handleAddTag} disabled={!currentTag.trim()}>
          <Tag className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button 
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => handleRemoveTag(tag)}
            >
              ×
            </button>
          </Badge>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-muted-foreground">No tags added yet</span>
        )}
      </div>
    </div>
  );
}

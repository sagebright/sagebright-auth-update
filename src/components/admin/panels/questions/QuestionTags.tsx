
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface QuestionTagsProps {
  tags: string[];
}

export function QuestionTags({ tags }: QuestionTagsProps) {
  if (tags.length === 0) {
    return <span className="text-xs text-muted-foreground">No tags</span>;
  }
  
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  );
}


import React from 'react';
import { Badge } from '@/components/ui/badge';

interface QuestionTypeBadgeProps {
  type: string;
  colorClass: string;
}

export function QuestionTypeBadge({ type, colorClass }: QuestionTypeBadgeProps) {
  const displayText = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <Badge className={colorClass}>
      {displayText}
    </Badge>
  );
}

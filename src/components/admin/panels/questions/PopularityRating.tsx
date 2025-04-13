
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface PopularityRatingProps {
  popularity: number;
  onUpdate: (delta: number) => void;
}

export function PopularityRating({ popularity, onUpdate }: PopularityRatingProps) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < popularity ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdate(1)}>
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdate(-1)}>
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  );
}

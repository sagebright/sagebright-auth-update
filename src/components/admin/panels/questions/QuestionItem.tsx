
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Clock, Calendar } from 'lucide-react';
import { Question } from './types';

// Question types with colors
const QUESTION_TYPES = {
  "icebreaker": "bg-blue-100 text-blue-800",
  "reflective": "bg-purple-100 text-purple-800",
  "team": "bg-green-100 text-green-800"
};

// Frequency options
const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "3x-week", label: "3x per Week" },
  { value: "biweekly", label: "Twice a Week" },
  { value: "weekly", label: "Weekly" },
  { value: "bimonthly", label: "Every 2 Weeks" },
  { value: "monthly", label: "Monthly" },
];

// Format date for display
const formatDate = (dateString: string) => {
  const options = { weekday: 'short' as const, month: 'short' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

interface QuestionItemProps {
  question: Question;
  provided: any;
  handleToggleActive: (id: number) => void;
  handleFrequencyChange: (id: number, frequency: string) => void;
}

export function QuestionItem({ question, provided, handleToggleActive, handleFrequencyChange }: QuestionItemProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`border rounded-md p-3 ${!question.active ? 'opacity-60 bg-gray-50' : 'bg-white'}`}
    >
      <div className="flex items-start gap-3">
        <div {...provided.dragHandleProps} className="mt-1">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <Badge className={QUESTION_TYPES[question.type]}>
              {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
            </Badge>
            <div className="flex items-center gap-2">
              <Switch
                checked={question.active}
                onCheckedChange={() => handleToggleActive(question.id)}
              />
              <span className="text-xs text-muted-foreground">
                {question.active ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
          
          <p className="text-sm mb-3">{question.text}</p>
          
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <Select
                value={question.frequency}
                onValueChange={(value) => handleFrequencyChange(question.id, value)}
              >
                <SelectTrigger className="h-7 text-xs w-[120px]">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>Next: {formatDate(question.nextDelivery)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { Question } from './types';

// Question types with colors
const QUESTION_TYPES = {
  "icebreaker": "bg-blue-100 text-blue-800",
  "reflective": "bg-purple-100 text-purple-800",
  "team": "bg-green-100 text-green-800"
};

// Format date for display
const formatDate = (dateString: string) => {
  const options = { weekday: 'short' as const, month: 'short' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

interface TimelineDay {
  date: string;
  displayDate: string;
  questions: Question[];
}

interface TimelinePreviewProps {
  timelinePreview: TimelineDay[];
}

export function TimelinePreview({ timelinePreview }: TimelinePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Timeline</CardTitle>
        <CardDescription>Preview of scheduled questions for the next 10 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {timelinePreview.map((day) => (
            <div key={day.date} className="border rounded-md p-3">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">{day.displayDate}</span>
              </div>
              
              {day.questions.length > 0 ? (
                <div className="space-y-2 pl-6">
                  {day.questions.map((question) => (
                    <div key={question.id} className="flex items-start gap-2">
                      <ArrowRight className="h-3 w-3 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{question.text}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className={QUESTION_TYPES[question.type] + " text-xs py-0"}>
                            {question.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground pl-6">No questions scheduled</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

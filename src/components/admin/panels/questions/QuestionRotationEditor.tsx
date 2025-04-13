
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { QuestionList } from './QuestionList';
import { TimelinePreview } from './TimelinePreview';
import { Question, TimelineDay } from './types';

// Sample active questions
const INITIAL_ACTIVE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What's one small win you had this week that you're proud of?",
    type: "reflective",
    frequency: "weekly",
    nextDelivery: "2025-04-22",
    active: true
  },
  {
    id: 2,
    text: "If you were a kitchen appliance, which one would you be and why?",
    type: "icebreaker",
    frequency: "monthly",
    nextDelivery: "2025-05-01",
    active: true
  },
  {
    id: 3,
    text: "What's one project you're excited about right now?",
    type: "team",
    frequency: "daily",
    nextDelivery: "2025-04-14",
    active: true
  },
  {
    id: 5,
    text: "What was your favorite movie growing up?",
    type: "icebreaker",
    frequency: "biweekly",
    nextDelivery: "2025-04-18",
    active: true
  },
];

// Format date for display
const formatDate = (dateString: string) => {
  const options = { weekday: 'short' as const, month: 'short' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export function QuestionRotationEditor() {
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(INITIAL_ACTIVE_QUESTIONS);
  
  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(activeQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setActiveQuestions(items);
  };
  
  // Handle toggle active
  const handleToggleActive = (id: number) => {
    setActiveQuestions(
      activeQuestions.map(q => 
        q.id === id ? { ...q, active: !q.active } : q
      )
    );
  };
  
  // Handle frequency change
  const handleFrequencyChange = (id: number, frequency: string) => {
    setActiveQuestions(
      activeQuestions.map(q => 
        q.id === id ? { ...q, frequency } : q
      )
    );
  };
  
  // Generate preview timeline
  const generateTimelinePreview = (): TimelineDay[] => {
    const now = new Date();
    const dates: TimelineDay[] = [];
    
    // Generate next 10 days
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      
      // Find questions scheduled for this date
      const questionsForDate = activeQuestions.filter(q => {
        if (!q.active) return false;
        return q.nextDelivery === formattedDate;
      });
      
      dates.push({
        date: formattedDate,
        displayDate: formatDate(formattedDate),
        questions: questionsForDate
      });
    }
    
    return dates;
  };
  
  const timelinePreview = generateTimelinePreview();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Rotation</CardTitle>
          <CardDescription>
            Manage the rotation schedule for active engagement questions.
            Drag and drop to reorder, toggle activation, and set delivery frequency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionList 
            activeQuestions={activeQuestions}
            handleDragEnd={handleDragEnd}
            handleToggleActive={handleToggleActive}
            handleFrequencyChange={handleFrequencyChange}
          />
        </CardContent>
      </Card>
      
      {/* Timeline Preview */}
      <TimelinePreview timelinePreview={timelinePreview} />
    </div>
  );
}

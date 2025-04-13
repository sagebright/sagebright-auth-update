
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Calendar, Clock, ArrowRight, Plus } from 'lucide-react';

// Sample active questions
const INITIAL_ACTIVE_QUESTIONS = [
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
const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export function QuestionRotationEditor() {
  const [activeQuestions, setActiveQuestions] = useState(INITIAL_ACTIVE_QUESTIONS);
  
  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(activeQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setActiveQuestions(items);
  };
  
  // Handle toggle active
  const handleToggleActive = (id) => {
    setActiveQuestions(
      activeQuestions.map(q => 
        q.id === id ? { ...q, active: !q.active } : q
      )
    );
  };
  
  // Handle frequency change
  const handleFrequencyChange = (id, frequency) => {
    setActiveQuestions(
      activeQuestions.map(q => 
        q.id === id ? { ...q, frequency } : q
      )
    );
  };
  
  // Generate preview timeline
  const generateTimelinePreview = () => {
    const now = new Date();
    const dates = [];
    
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
        displayDate: formatDate(date),
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
          <div className="mb-4 flex justify-end">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add from Question Bank
            </Button>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {activeQuestions.map((question, index) => (
                    <Draggable key={question.id} draggableId={String(question.id)} index={index}>
                      {(provided) => (
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
                                    size="sm"
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {activeQuestions.length === 0 && (
                    <div className="text-center p-8 border rounded-md">
                      <p className="text-muted-foreground">
                        No active questions. Add questions from the question bank.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
      
      {/* Timeline Preview */}
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
    </div>
  );
}

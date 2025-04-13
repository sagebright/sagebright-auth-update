
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { QuestionItem } from './QuestionItem';
import { Question } from './types';

interface QuestionListProps {
  activeQuestions: Question[];
  handleDragEnd: (result: any) => void;
  handleToggleActive: (id: number) => void;
  handleFrequencyChange: (id: number, frequency: string) => void;
}

export function QuestionList({ 
  activeQuestions, 
  handleDragEnd, 
  handleToggleActive, 
  handleFrequencyChange 
}: QuestionListProps) {
  return (
    <>
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
                    <QuestionItem
                      question={question}
                      provided={provided}
                      handleToggleActive={handleToggleActive}
                      handleFrequencyChange={handleFrequencyChange}
                    />
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
    </>
  );
}

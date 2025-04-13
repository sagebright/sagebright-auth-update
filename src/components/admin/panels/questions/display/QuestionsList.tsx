
import React from 'react';
import { QuestionCard } from '../QuestionCard';
import { EmptyQuestionsList } from './EmptyQuestionsList';

interface Question {
  id: number;
  text: string;
  type: string;
  tags: string[];
  department: string;
  popularity: number;
  active: boolean;
}

interface QuestionsListProps {
  questions: Question[];
  onUpdate: (question: Question) => void;
  getTypeColor: (type: string) => string;
}

export function QuestionsList({ questions, onUpdate, getTypeColor }: QuestionsListProps) {
  if (questions.length === 0) {
    return <EmptyQuestionsList />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {questions.map((question) => (
        <QuestionCard 
          key={question.id} 
          question={question}
          onUpdate={onUpdate}
          typeColor={getTypeColor(question.type)}
        />
      ))}
    </div>
  );
}

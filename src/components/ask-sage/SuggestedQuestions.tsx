
import React from 'react';
import { Button } from '@/components/ui/button';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onSelectQuestion 
}) => {
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Ask Sage about…</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {questions.map((question, index) => (
          <Button 
            key={index} 
            variant="outline"
            className="justify-start h-auto py-3 px-4 text-left hover:bg-gray-50 border-gray-200"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

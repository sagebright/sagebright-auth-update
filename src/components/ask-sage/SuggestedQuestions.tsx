
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Target 
} from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onSelectQuestion 
}) => {
  // Map of icons for each question
  const getIconForQuestion = (question: string) => {
    if (question.includes('development environment')) return <Code className="w-4 h-4 mr-2" />;
    if (question.includes('add value')) return <Lightbulb className="w-4 h-4 mr-2" />;
    if (question.includes('who on my team')) return <Users className="w-4 h-4 mr-2" />;
    if (question.includes('high performers')) return <TrendingUp className="w-4 h-4 mr-2" />;
    if (question.includes('goals')) return <Target className="w-4 h-4 mr-2" />;
    return null;
  };

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
            {getIconForQuestion(question)}
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

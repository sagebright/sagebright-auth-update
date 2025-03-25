
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  TrendingUp, 
  Code,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onSelectQuestion 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Show only two initial questions unless expanded
  const displayedQuestions = expanded ? questions : questions.slice(0, 2);

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
    <div className="max-w-3xl mx-auto mt-4">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Ask Sage about…</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayedQuestions.map((question, index) => (
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
      
      {questions.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sagebright-green hover:text-sagebright-green/80 text-sm font-medium flex items-center mt-3 transition-colors"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp size={16} className="ml-1" />
            </>
          ) : (
            <>
              Show more
              <ChevronDown size={16} className="ml-1" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

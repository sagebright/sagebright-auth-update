
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clipboard, BarChart3, Plus, Calendar } from 'lucide-react';
import { QuestionBankEditor } from './questions/QuestionBankEditor';
import { QuestionRotationEditor } from './questions/QuestionRotationEditor';
import { SectionWrapper } from '../SectionWrapper';
import { EmptyState } from '../EmptyState';
import { CategoryList } from './questions/CategoryList';
import { AnalyticsView } from './questions/AnalyticsView';

export function EngagementQuestionsPanel() {
  // Sample question categories
  const categories = [
    {
      id: 1,
      name: 'Onboarding',
      count: 24,
      description: 'Questions related to new employee onboarding process',
    },
    {
      id: 2,
      name: 'Policy',
      count: 15,
      description: 'Questions about company policies and procedures',
    },
    {
      id: 3,
      name: 'Benefits',
      count: 12,
      description: 'Questions about employee benefits and perks',
    },
    {
      id: 4,
      name: 'Technical',
      count: 18,
      description: 'Technical questions about tools and systems',
    },
  ];

  // Sample top questions
  const topQuestions = [
    "How do I request time off?",
    "Where can I find the employee handbook?",
    "What's the process for expense reimbursement?",
    "How do I set up my email account?",
    "Who should I contact for IT support?"
  ];

  const [activeTab, setActiveTab] = useState('question-bank');
  const [hasQuestions, setHasQuestions] = useState(true); // Toggle this for empty state demo

  return (
    <SectionWrapper
      title="Engagement Questions"
      description="Create, manage, and schedule engagement questions for your team"
      id="engagement-questions-section"
    >
      <Tabs 
        defaultValue="question-bank" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="question-bank">
            <MessageSquare className="h-4 w-4 mr-2" />
            Question Bank
          </TabsTrigger>
          <TabsTrigger value="rotation">
            <Calendar className="h-4 w-4 mr-2" />
            Question Rotation
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Clipboard className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="question-bank" className="space-y-6">
          {hasQuestions ? (
            <QuestionBankEditor />
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Your question bank is empty"
              description="Add questions to your bank to start engaging with your team members."
              actionLabel="Add First Question"
              onAction={() => setHasQuestions(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="rotation" className="space-y-6">
          {hasQuestions ? (
            <QuestionRotationEditor />
          ) : (
            <EmptyState
              icon={Calendar}
              title="No questions in rotation"
              description="Add questions from your question bank to create a rotation schedule."
              actionLabel="Set Up Rotation"
              onAction={() => {
                setHasQuestions(true);
                setActiveTab('question-bank');
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsView topQuestions={topQuestions} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryList categories={categories} />
        </TabsContent>
      </Tabs>
    </SectionWrapper>
  );
}

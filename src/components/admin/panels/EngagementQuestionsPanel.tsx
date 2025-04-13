
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clipboard, BarChart3, Plus } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Categories</CardTitle>
            <CardDescription>Manage question categories for better organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex justify-between items-center p-3 rounded-md border">
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {category.count} questions
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardFooter>
        </Card>
        
        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question Analytics</CardTitle>
            <CardDescription>Review engagement metrics and popular questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Top 5 Questions</h4>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <ul className="space-y-2">
                  {topQuestions.map((question, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-xs bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-gray-50 text-center">
                  <h4 className="text-2xl font-bold text-primary">94%</h4>
                  <p className="text-xs text-muted-foreground">Question Answer Rate</p>
                </div>
                <div className="p-4 rounded-md bg-gray-50 text-center">
                  <h4 className="text-2xl font-bold text-primary">457</h4>
                  <p className="text-xs text-muted-foreground">Questions This Month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Question Management Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Question Management</CardTitle>
          <CardDescription>Add, edit, and manage engagement questions and their responses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <Button variant="default" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add New Question
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Clipboard className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
          
          <div className="rounded-md border p-8 flex justify-center items-center">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">Question Management Table</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This is a placeholder for the question management table that would display questions, categories, engagement metrics, and allow CRUD operations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

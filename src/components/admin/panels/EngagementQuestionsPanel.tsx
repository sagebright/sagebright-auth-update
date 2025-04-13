
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Clipboard, BarChart3, Plus, Calendar } from 'lucide-react';
import { QuestionBankEditor } from './questions/QuestionBankEditor';
import { QuestionRotationEditor } from './questions/QuestionRotationEditor';

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

  return (
    <div className="space-y-6">
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
          <QuestionBankEditor />
        </TabsContent>

        <TabsContent value="rotation" className="space-y-6">
          <QuestionRotationEditor />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                <CardDescription>Response rates and user participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-gray-50">
                    <h4 className="font-medium mb-2">Response Rate by Department</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Engineering</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Marketing</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Sales</span>
                        <span className="font-medium">76%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span>Operations</span>
                        <span className="font-medium">83%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '83%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

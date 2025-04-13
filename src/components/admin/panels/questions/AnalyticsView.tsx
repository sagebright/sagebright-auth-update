
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface AnalyticsViewProps {
  topQuestions: string[];
}

export function AnalyticsView({ topQuestions }: AnalyticsViewProps) {
  return (
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
  );
}

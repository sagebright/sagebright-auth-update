import React, { useState } from 'react';
import { DashboardContainer } from '@/components/layout/DashboardContainer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { callOpenAI } from '@/lib/api';
import { useAuth } from '@/contexts/auth/AuthContext';
import { buildSageContext } from '@/lib/buildSageContext';
import { DebugPanel } from '@/components/debug/DebugPanel';

const ApiDebug = () => {
  const { userId, orgId, orgSlug, currentUser } = useAuth();
  const [question, setQuestion] = useState('What is my role at Riverbend Solar?');
  const [voice, setVoice] = useState('skeptic');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setError('');
    
    try {
      if (!userId || !orgId) {
        throw new Error('Missing userId or orgId. Please log in.');
      }
      
      const context = await buildSageContext(userId, orgId, orgSlug, currentUser);
      const result = await callOpenAI({ question, context, voice });
      setResponse(result);
    } catch (err) {
      console.error('API Debug error:', err);
      setError((err as Error).message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">API Debug Console</h1>
        
        <Tabs defaultValue="test">
          <TabsList className="mb-4">
            <TabsTrigger value="test">Test API</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test OpenAI API</CardTitle>
                <CardDescription>
                  Send a test request to the OpenAI API using your current auth context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Textarea 
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter your question"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice Parameter</Label>
                    <Input
                      id="voice"
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      placeholder="default, skeptic, cheerful, etc."
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading || !userId || !orgId}>
                    {loading ? 'Sending...' : 'Send Request'}
                  </Button>
                  
                  {!userId || !orgId ? (
                    <p className="text-destructive text-sm">
                      You must be logged in with a valid userId and orgId to test the API
                    </p>
                  ) : null}
                </form>
              </CardContent>
            </Card>
            
            {(response || error) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{error ? 'Error Response' : 'API Response'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <div className="p-4 bg-destructive/10 rounded border border-destructive/20 text-destructive">
                      {error}
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded whitespace-pre-wrap">
                      {response}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Internal documentation for the Sage API integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">API Flow</h3>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>User authentication is validated</li>
                    <li>Context is built from user and org data</li>
                    <li>Voice parameter is extracted from URL</li>
                    <li>Context and request are validated with Zod</li>
                    <li>OpenAI API is called with the complete payload</li>
                    <li>Response is logged and returned to the user</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Available Voice Parameters</h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><code className="bg-muted px-1 rounded">default</code> - Standard Sage voice</li>
                    <li><code className="bg-muted px-1 rounded">skeptic</code> - More critical and questioning</li>
                    <li><code className="bg-muted px-1 rounded">cheerful</code> - Enthusiastic and positive</li>
                    <li><code className="bg-muted px-1 rounded">brief</code> - Concise and direct</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <DebugPanel />
    </DashboardContainer>
  );
};

export default ApiDebug;

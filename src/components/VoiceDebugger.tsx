
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testVoiceInjection, testApiErrorHandling } from '@/utils/testUtils';
import { voiceprints } from '@/lib/voiceprints';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocation } from 'react-router-dom';

interface TestResult {
  voice: string;
  isValid: boolean;
  promptIncludesVoiceprint: boolean;
  promptLength: number;
  success: boolean;
}

interface ApiTestResult {
  success: boolean;
  message: string;
}

export function VoiceDebugger() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [apiTestResult, setApiTestResult] = useState<ApiTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<string>('default');
  const location = useLocation();

  // Extract the current voice parameter from URL if any
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const voiceParam = params.get('voice');
    if (voiceParam) {
      setCurrentVoice(voiceParam);
    }
  }, [location.search]);

  const runVoiceTests = async () => {
    setIsLoading(true);
    
    try {
      // Test default voice first
      const defaultResult = await testVoiceInjection('default');
      const testResults = [defaultResult];
      
      // Test all available voices from voiceprints
      const voices = Object.keys(voiceprints).filter(v => v !== 'default');
      for (const voice of voices) {
        const result = await testVoiceInjection(voice);
        testResults.push(result);
      }
      
      // Add an invalid voice test
      const invalidResult = await testVoiceInjection('nonexistent-voice');
      testResults.push(invalidResult);
      
      setResults(testResults);
    } catch (error) {
      console.error("Error running voice tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const runApiErrorTest = async () => {
    setIsLoading(true);
    try {
      const result = await testApiErrorHandling();
      setApiTestResult(result);
    } catch (error) {
      console.error("Error running API error test:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Parameter Test Suite</CardTitle>
          <CardDescription>
            Test the voice parameter handling in the Sage prompts system
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentVoice && (
            <div className="bg-primary/10 p-4 rounded-md mb-4">
              <p className="font-medium">Currently Active Voice Parameter: <span className="text-primary">{currentVoice}</span></p>
              <p className="text-sm text-muted-foreground mt-1">
                {voiceprints[currentVoice] 
                  ? "This is a valid voice parameter" 
                  : "This is not a recognized voice parameter - it should default to the 'default' voice"}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={runVoiceTests} 
              disabled={isLoading}
            >
              {isLoading ? 'Running Tests...' : 'Test Voice Parameters'}
            </Button>
            <Button 
              onClick={runApiErrorTest} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Testing...' : 'Test API Error Handling'}
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="voiceprints">
              <AccordionTrigger>Available Voiceprints</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(voiceprints).map((voice) => (
                    <div key={voice} className="border p-3 rounded-md">
                      <h3 className="font-medium mb-1">{voice}</h3>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {voiceprints[voice].substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Voice Test Results</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Voice</th>
                      <th className="p-2 text-left">Valid?</th>
                      <th className="p-2 text-left">Voiceprint Included?</th>
                      <th className="p-2 text-left">Prompt Length</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{result.voice}</td>
                        <td className="p-2">{result.isValid ? '✅' : '❌'}</td>
                        <td className="p-2">{result.promptIncludesVoiceprint ? '✅' : '❌'}</td>
                        <td className="p-2">{result.promptLength}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {result.success ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {apiTestResult && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">API Error Handling Test</h3>
              <div className={`p-4 rounded-md ${apiTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center">
                  <span className={`mr-2 text-lg ${apiTestResult.success ? 'text-green-500' : 'text-red-500'}`}>
                    {apiTestResult.success ? '✅' : '❌'}
                  </span>
                  <span className="font-medium">{apiTestResult.message}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Configuration Check</CardTitle>
          <CardDescription>
            Verify your OpenAI API configuration settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium">API Endpoint:</p>
              <p className="text-muted-foreground">{import.meta.env.VITE_OPENAI_PROXY_URL || '/api/openai'} {!import.meta.env.VITE_OPENAI_PROXY_URL && "(Using default fallback)"}</p>
            </div>
            <div>
              <p className="font-medium">Model:</p>
              <p className="text-muted-foreground">{import.meta.env.VITE_OPENAI_MODEL || 'gpt-4'} {!import.meta.env.VITE_OPENAI_MODEL && "(Using default fallback)"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

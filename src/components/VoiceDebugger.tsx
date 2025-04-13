
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testVoiceInjection, testApiErrorHandling } from '@/utils/testUtils';
import { voiceprints } from '@/lib/voiceprints';

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

  const runVoiceTests = async () => {
    setIsLoading(true);
    const voices = Object.keys(voiceprints);
    const testResults = [];
    
    // Add 'default' voice
    const defaultResult = await testVoiceInjection('default');
    testResults.push(defaultResult);
    
    // Add a few specific voices for testing
    for (const voice of ['mirror', 'skeptic', 'professor']) {
      const result = await testVoiceInjection(voice);
      testResults.push(result);
    }
    
    // Add an invalid voice
    const invalidResult = await testVoiceInjection('nonexistent-voice');
    testResults.push(invalidResult);
    
    setResults(testResults);
    setIsLoading(false);
  };

  const runApiErrorTest = async () => {
    setIsLoading(true);
    const result = await testApiErrorHandling();
    setApiTestResult(result);
    setIsLoading(false);
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
        <CardContent className="space-y-4">
          <div className="flex gap-4">
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
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { testVoiceInjection, testAllVoices } from '@/utils/testVoiceInjection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { voiceprints } from '@/lib/voiceprints';
import { useVoiceParam } from '@/hooks/use-voice-param';

export const VoiceDebugger = () => {
  const [testResults, setTestResults] = useState<Array<{voice: string, success: boolean}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  
  // Use our custom hook to get the current voice parameter
  const currentVoice = useVoiceParam();
  
  const runSingleTest = (voice: string) => {
    setIsLoading(true);
    setSelectedVoice(voice);
    
    // Small timeout to let UI update
    setTimeout(() => {
      const result = testVoiceInjection(voice);
      setTestResults([{ voice, success: result }]);
      setIsLoading(false);
    }, 10);
  };
  
  const runAllTests = () => {
    setIsLoading(true);
    setSelectedVoice(null);
    
    // Small timeout to let UI update
    setTimeout(() => {
      const results = testAllVoices();
      setTestResults(results);
      setIsLoading(false);
    }, 10);
  };
  
  // Run test for current voice on mount
  useEffect(() => {
    if (currentVoice) {
      runSingleTest(currentVoice);
    }
  }, []);
  
  return (
    <Card className="max-w-3xl mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Voice Parameter Debugger</span>
          {currentVoice && (
            <span className="text-sm font-normal bg-secondary/20 px-2 py-1 rounded">
              Current: {currentVoice}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => runSingleTest(currentVoice || 'default')} 
              disabled={isLoading}
              variant="outline"
            >
              Test Current Voice
            </Button>
            <Button 
              onClick={runAllTests} 
              disabled={isLoading}
              variant="outline"
            >
              Test All Voices
            </Button>
            {Object.keys(voiceprints).map(voice => (
              <Button 
                key={voice}
                onClick={() => runSingleTest(voice)} 
                disabled={isLoading || selectedVoice === voice}
                variant={voice === currentVoice ? "default" : "outline"}
                size="sm"
              >
                {voice}
              </Button>
            ))}
          </div>
          
          {isLoading && (
            <div className="text-center py-4">
              Testing voices... Check browser console for detailed logs.
            </div>
          )}
          
          {!isLoading && testResults.length > 0 && (
            <div className="border rounded p-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Test Results</h3>
              <div className="space-y-2">
                {testResults.map(({ voice, success }) => (
                  <div 
                    key={voice} 
                    className={`p-2 rounded flex justify-between ${
                      success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span>{voice}</span>
                    <span>{success ? '✅ Passed' : '❌ Failed'}</span>
                  </div>
                ))}
              </div>
              
              {testResults.every(r => r.success) ? (
                <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
                  All tested voices are working correctly!
                </div>
              ) : (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                  Some voices failed testing. Check console logs for details.
                </div>
              )}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-4">
            Note: This component should only be shown in development mode. 
            Check console for detailed test logs.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

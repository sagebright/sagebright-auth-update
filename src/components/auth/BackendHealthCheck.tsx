
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/constants';

/**
 * Backend health check component for development and diagnostics
 * This helps identify CORS and API connectivity issues
 */
export default function BackendHealthCheck() {
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<{
    time: string;
    status: 'success' | 'error';
    message: string;
  } | null>(null);

  const checkHealth = async () => {
    setChecking(true);
    
    try {
      const startTime = performance.now();
      
      // Try the session endpoint first (most important)
      const sessionResponse = await fetch(`${API_BASE_URL}/auth/session`, {
        method: 'GET',
        credentials: 'include', // Include credentials for cross-origin requests
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);
      
      if (sessionResponse.ok) {
        setLastCheck({
          time: new Date().toLocaleTimeString(),
          status: 'success',
          message: `Backend responded in ${timeMs}ms (status ${sessionResponse.status})`
        });
        
        toast({
          title: "Backend is reachable",
          description: `API responded in ${timeMs}ms with status ${sessionResponse.status}`,
        });
      } else {
        setLastCheck({
          time: new Date().toLocaleTimeString(),
          status: 'error',
          message: `Backend responded with error ${sessionResponse.status} in ${timeMs}ms`
        });
        
        toast({
          variant: "destructive",
          title: "Backend error",
          description: `API returned status ${sessionResponse.status}`,
        });
      }
    } catch (error) {
      setLastCheck({
        time: new Date().toLocaleTimeString(),
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      const isCorsError = error instanceof TypeError && error.message === 'Failed to fetch';
      
      toast({
        variant: "destructive",
        title: isCorsError ? "CORS Error" : "Connection Error",
        description: isCorsError 
          ? "Backend blocked the request due to CORS. Enable CORS on your backend."
          : "Could not reach backend API",
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50 mb-4">
      <h3 className="text-sm font-semibold mb-2">Backend Connection Diagnostics</h3>
      
      <div className="flex gap-2 mb-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={checkHealth}
          disabled={checking}
        >
          {checking ? "Checking..." : "Check API Connection"}
        </Button>
      </div>
      
      {lastCheck && (
        <div className={`text-xs p-2 rounded ${
          lastCheck.status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="font-medium">{lastCheck.time} - {lastCheck.status === 'success' ? '✅' : '❌'}</div>
          <div>{lastCheck.message}</div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Backend URL: {API_BASE_URL}</p>
        <p className="mt-1">
          ℹ️ If requests fail with CORS errors, you need to enable CORS on your backend for this origin.
        </p>
      </div>
    </div>
  );
}


import React from 'react';
import { useDebugPanel } from '@/hooks/use-debug-panel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mic, Monitor, Check, X, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DebugPanel() {
  const {
    isVisible,
    toggleVisibility,
    debugInfo,
    isDev
  } = useDebugPanel();
  
  // Only render in development mode
  if (!isDev) return null;
  
  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 h-8 w-8 bg-background/80 backdrop-blur-sm shadow-md"
        onClick={toggleVisibility}
      >
        <Eye className="h-4 w-4" />
      </Button>
    );
  }
  
  const { voice, context, request } = debugInfo;
  
  // Get status icon based on request status
  const getStatusIcon = () => {
    switch (request.status) {
      case 'loading':
        return <Loader className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'success':
        return <Check className="h-4 w-4 text-primary" />;
      case 'error':
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <Monitor className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 bg-background border rounded-md shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-muted/50">
        <h3 className="text-sm font-medium">Debug Panel</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleVisibility}>
          <EyeOff className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3 space-y-3 text-xs">
        {/* Voice Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium flex items-center gap-1">
              <Mic className="h-3.5 w-3.5" /> Voice
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-medium",
              voice.param === 'default' 
                ? "bg-muted text-muted-foreground" 
                : "bg-primary/20 text-primary"
            )}>
              {voice.param}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 text-[10px] text-muted-foreground">
            <span>Source:</span>
            <span>{voice.source}</span>
            <span>Raw Query:</span>
            <span className="truncate">{voice.raw || '(empty)'}</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Context Section */}
        <div className="space-y-1">
          <span className="font-medium">Context</span>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
            <span>User ID:</span>
            <span className="truncate">{context.userId || '(null)'}</span>
            <span>Org ID:</span>
            <span className="truncate">{context.orgId || '(null)'}</span>
            <span>Has Session User:</span>
            <span>{context.hasUser ? 'Yes' : 'No'}</span>
            <span>Has User Metadata:</span>
            <span>{context.hasUserMetadata ? 'Yes' : 'No'}</span>
            <span>Has Current User:</span>
            <span>{context.hasCurrentUser ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Request Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium flex items-center gap-1">
              <Monitor className="h-3.5 w-3.5" /> API Status
            </span>
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              <span className={cn(
                "capitalize text-[10px]",
                request.status === 'error' && "text-destructive",
                request.status === 'success' && "text-primary"
              )}>
                {request.status}
              </span>
            </span>
          </div>
          
          {request.timestamp && (
            <div className="grid grid-cols-2 gap-x-2 text-[10px] text-muted-foreground">
              <span>Timestamp:</span>
              <span>{new Date(request.timestamp).toLocaleTimeString()}</span>
              
              {request.responseTime && (
                <>
                  <span>Response Time:</span>
                  <span>{request.responseTime}ms</span>
                </>
              )}
              
              {request.error && (
                <>
                  <span>Error:</span>
                  <span className="text-destructive truncate">{request.error}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

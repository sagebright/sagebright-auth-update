
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Link } from 'react-router-dom';

export const OrgRecoveryUI = () => {
  const { user, refreshSession } = useAuth();
  const [isAttemptingRecovery, setIsAttemptingRecovery] = React.useState(false);
  
  const handleRecoveryAttempt = async () => {
    if (!user?.id) return;
    
    setIsAttemptingRecovery(true);
    try {
      await refreshSession('org context recovery');
      // Wait a moment before reloading
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Recovery attempt failed:', error);
    } finally {
      setIsAttemptingRecovery(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-accent1">Organization Context Missing</CardTitle>
          <CardDescription>
            We're having trouble loading your organization context
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your account is missing required organization data. This can happen when switching devices or after a long period of inactivity.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              onClick={handleRecoveryAttempt}
              className="bg-primary"
              disabled={isAttemptingRecovery}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isAttemptingRecovery ? "Recovering..." : "Recover Automatically"}
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/auth/recovery">
                Manual Recovery Options
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          If recovery fails, try clearing your browser cache or signing out and back in.
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrgRecoveryUI;

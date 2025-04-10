
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { syncUserRole } from '@/lib/syncUserRole';

interface AuthRecoveryProps {
  userId?: string | null;
  error?: string;
  variant?: 'inline' | 'dialog' | 'page';
  onRecoverySuccess?: () => void;
}

const AuthRecovery: React.FC<AuthRecoveryProps> = ({
  userId,
  error = 'An authentication issue was detected with your account',
  variant = 'inline',
  onRecoverySuccess,
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAttemptingRecovery, setIsAttemptingRecovery] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<'success' | 'failed' | null>(null);
  const [dialogOpen, setDialogOpen] = useState(variant === 'dialog');
  
  // Use user ID from auth context if not provided as prop
  const actualUserId = userId || user?.id || null;

  const handleRecoveryAttempt = async () => {
    if (!actualUserId) {
      setRecoveryResult('failed');
      return;
    }

    setIsAttemptingRecovery(true);
    setRecoveryResult(null);

    try {
      console.log("🔄 Attempting to recover auth context for user:", actualUserId);
      const result = await syncUserRole(actualUserId);
      
      console.log("✅ Recovery result:", result);
      setRecoveryResult('success');
      
      // Reload the page to refresh auth state with new metadata
      setTimeout(() => {
        if (onRecoverySuccess) {
          onRecoverySuccess();
        } else {
          window.location.reload();
        }
      }, 1500);
    } catch (recoveryError) {
      console.error("❌ Recovery failed:", recoveryError);
      setRecoveryResult('failed');
    } finally {
      setIsAttemptingRecovery(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/auth/login');
    setDialogOpen(false);
  };

  // Content to be displayed in any variant
  const content = (
    <>
      <div className="space-y-4">
        <Alert variant="destructive" className="border-accent1 bg-accent1/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Issue</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>

        {recoveryResult === 'success' && (
          <Alert variant="default" className="border-green-500 bg-green-50">
            <AlertTitle>Recovery Successful</AlertTitle>
            <AlertDescription>
              Your account has been recovered. Reloading page...
            </AlertDescription>
          </Alert>
        )}

        {recoveryResult === 'failed' && (
          <Alert variant="destructive">
            <AlertTitle>Recovery Failed</AlertTitle>
            <AlertDescription>
              Unable to recover your account. Please try signing out and back in.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <Button
          onClick={handleRecoveryAttempt}
          disabled={isAttemptingRecovery || !actualUserId || recoveryResult === 'success'}
          className="bg-primary"
          loading={isAttemptingRecovery}
          loadingText="Attempting Recovery..."
        >
          {!isAttemptingRecovery && (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try to Recover
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isAttemptingRecovery}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );

  // Dialog variant
  if (variant === 'dialog') {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account Recovery Required</DialogTitle>
            <DialogDescription>
              We've detected an issue with your account authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Page variant
  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account Recovery Required</CardTitle>
            <CardDescription>
              We've detected an issue with your account authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default inline variant
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Authentication Recovery</CardTitle>
        <CardDescription>
          We've detected an issue with your account that needs to be fixed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
      <CardFooter className="flex justify-end">
        <p className="text-xs text-muted-foreground">
          If recovery fails, please contact support.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthRecovery;

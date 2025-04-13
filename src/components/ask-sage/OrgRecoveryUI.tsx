
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/components/ui/use-toast";

interface OrgRecoveryUIProps {
  userId: string | null;
}

export const OrgRecoveryUI: React.FC<OrgRecoveryUIProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [isRecovering, setIsRecovering] = useState(false);

  const handleTryRecover = async () => {
    setIsRecovering(true);
    try {
      console.log("🔄 Manually attempting recovery of organization context");
      
      // Try to refresh session first
      await supabase.auth.refreshSession();
      
      // Try to get user from database
      const { data, error } = await supabase
        .from('users')
        .select('org_id')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("❌ Error fetching user data:", error);
        throw new Error("Failed to fetch user data");
      }
      
      if (data?.org_id) {
        console.log("✅ Found org_id in database:", data.org_id);
        
        // Update user metadata with org_id
        const { error: updateError } = await supabase.auth.updateUser({
          data: { org_id: data.org_id }
        });
        
        if (updateError) {
          console.error("❌ Error updating user metadata:", updateError);
          throw new Error("Failed to update user metadata");
        }
        
        // Force refresh session to get updated metadata
        await supabase.auth.refreshSession();
        
        toast({
          title: "Recovery Successful",
          description: "Your organization context has been restored."
        });
        
        // Reload the page to pick up the new org context
        window.location.reload();
      } else {
        console.error("❌ No org_id found for user in database");
        throw new Error("No organization found for your account");
      }
    } catch (error) {
      console.error("Recovery error:", error);
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: "Unable to recover your organization context. Please contact support."
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Error signing out',
        description: 'Failed to sign out. Please try again.'
      });
    }
  };

  return (
    <div className="container mx-auto max-w-md py-16 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Account Recovery Required</h2>
        <p className="mb-6">Your account needs to be connected to an organization to use Sage.</p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleTryRecover} 
            className="w-full" 
            disabled={isRecovering}
          >
            {isRecovering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recovering...
              </>
            ) : (
              'Try to Recover'
            )}
          </Button>
          
          <Button 
            onClick={handleSignOut} 
            variant="outline" 
            className="w-full"
            disabled={isRecovering}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

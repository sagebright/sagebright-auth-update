
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthRecovery from '@/components/auth/AuthRecovery';
import { Link } from 'react-router-dom';

export default function RecoveryPage() {
  const { user } = useAuth();

  return (
    <AuthLayout
      title="Account Recovery"
      heading="Authentication Issue Detected"
      subheading="Let's fix your account authentication"
      footer={
        <p className="text-sm text-gray-600 font-roboto">
          Need help? <Link to="/contact-us" className="text-primary hover:underline">Contact support</Link>
        </p>
      }
    >
      <>{/* Description */}
        We've detected an issue with your account authentication that needs to be resolved.
      </>
      
      <>{/* Content */}
        <AuthRecovery 
          userId={user?.id} 
          variant="inline"
          error="Your account is missing required organization context." 
        />
      </>
    </AuthLayout>
  );
}

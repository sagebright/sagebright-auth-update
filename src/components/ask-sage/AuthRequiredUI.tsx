
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AuthRequiredUI: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-md py-16 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-6">You need to be logged in to use Sage.</p>
        <Button onClick={() => navigate('/auth/login')} className="w-full">
          Go to Login
        </Button>
      </div>
    </div>
  );
};

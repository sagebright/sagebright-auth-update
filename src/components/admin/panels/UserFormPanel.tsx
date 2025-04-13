
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserForm } from '../UserForm';
import { toast } from 'sonner';

export function UserFormPanel() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    toast.success('User saved successfully');
    // In a real app, you would save the data to your backend here
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // In a real app, you would navigate away or close the form
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User</CardTitle>
        <CardDescription>
          Add a new user to your organization or edit an existing one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </CardContent>
    </Card>
  );
}

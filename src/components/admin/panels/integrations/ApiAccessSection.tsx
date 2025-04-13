
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2 } from 'lucide-react';

export function ApiAccessSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Access</CardTitle>
        <CardDescription>Manage API keys and access for developers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border p-8 flex justify-center items-center">
          <div className="text-center">
            <Link2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="text-lg font-medium">API Key Management</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This is a placeholder for API key management where you could create, revoke, and monitor usage of API keys.
            </p>
            <Button variant="outline" className="mt-4">Generate New API Key</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

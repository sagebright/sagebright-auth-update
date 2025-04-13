
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderTree, Users } from 'lucide-react';

interface OrgChartPreviewProps {
  department?: string;
  supervisor?: string;
}

export const OrgChartPreview: React.FC<OrgChartPreviewProps> = ({ 
  department = 'Unassigned', 
  supervisor = 'Unassigned' 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FolderTree className="h-4 w-4" />
          Organization Chart Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg text-center space-y-4">
          <Users className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Department: {department}</h3>
            <p className="text-sm text-muted-foreground">Supervisor: {supervisor}</p>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            This is a placeholder for the organization chart preview. In a production environment, 
            this would display a visual representation of the department structure and reporting relationships.
          </p>
          <button className="text-xs text-primary underline">
            View full organization chart
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

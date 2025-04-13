
import React from 'react';
import { Search } from 'lucide-react';

export function EmptyQuestionsList() {
  return (
    <div className="col-span-2 p-8 border rounded-md text-center">
      <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">No questions found</h3>
      <p className="text-sm text-muted-foreground">
        Try adjusting your search or filters, or add a new question.
      </p>
    </div>
  );
}

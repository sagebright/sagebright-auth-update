
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  count: number;
  description: string;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Question Categories</CardTitle>
        <CardDescription>Manage question categories for better organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex justify-between items-center p-3 rounded-md border">
              <div>
                <h4 className="font-medium">{category.name}</h4>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
              <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                {category.count} questions
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </CardFooter>
    </Card>
  );
}

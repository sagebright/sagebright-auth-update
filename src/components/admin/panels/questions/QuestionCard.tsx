
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { PopularityRating } from './PopularityRating';
import { EditDialog, DeleteDialog } from './QuestionDialogs';
import { QuestionTypeBadge } from './QuestionTypeBadge';
import { QuestionTags } from './QuestionTags';

interface QuestionProps {
  question: {
    id: number;
    text: string;
    type: string;
    tags: string[];
    department: string;
    popularity: number;
    active: boolean;
  };
  typeColor: string;
  onUpdate: (question: any) => void;
}

export function QuestionCard({ question, typeColor, onUpdate }: QuestionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(question.text);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleToggleActive = () => {
    onUpdate({
      ...question,
      active: !question.active
    });
  };
  
  const handleEditSave = () => {
    if (editedText.trim()) {
      onUpdate({
        ...question,
        text: editedText
      });
      setIsEditing(false);
    }
  };
  
  const handleDelete = () => {
    // In a real app, you would call an API here
    console.log("Deleting question:", question.id);
    setConfirmDelete(false);
  };
  
  const handleUpdatePopularity = (delta: number) => {
    const newPopularity = Math.max(0, Math.min(5, question.popularity + delta));
    onUpdate({
      ...question,
      popularity: newPopularity
    });
  };
  
  return (
    <>
      <Card className={`overflow-hidden ${!question.active ? 'opacity-70' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <QuestionTypeBadge type={question.type} colorClass={typeColor} />
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm mb-3">{question.text}</p>
          
          <div className="mb-3">
            <QuestionTags tags={question.tags} />
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">Popularity:</span>
              <PopularityRating 
                popularity={question.popularity} 
                onUpdate={handleUpdatePopularity} 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Active</span>
              <Switch
                checked={question.active}
                onCheckedChange={handleToggleActive}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <EditDialog 
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        text={editedText}
        onTextChange={setEditedText}
        onSave={handleEditSave}
      />

      <DeleteDialog 
        isOpen={confirmDelete}
        onOpenChange={setConfirmDelete}
        onDelete={handleDelete}
      />
    </>
  );
}

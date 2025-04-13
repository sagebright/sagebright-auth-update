
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Trash2, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
  
  // Render stars for popularity rating
  const renderPopularity = () => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < question.popularity ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };
  
  return (
    <>
      <Card className={`overflow-hidden ${!question.active ? 'opacity-70' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge className={`${typeColor}`}>
              {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
            </Badge>
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
          
          <div className="flex flex-wrap gap-1 mb-3">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">Popularity:</span>
              <div className="flex items-center">
                {renderPopularity()}
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleUpdatePopularity(1)}>
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleUpdatePopularity(-1)}>
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
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

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this question? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

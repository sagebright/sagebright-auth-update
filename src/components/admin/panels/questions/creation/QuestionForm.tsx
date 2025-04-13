
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Sparkles } from 'lucide-react';
import { QuestionFormTags } from './QuestionFormTags';

interface Department {
  value: string;
  label: string;
}

interface QuestionType {
  value: string;
  label: string;
  color: string;
}

interface NewQuestion {
  text: string;
  type: string;
  tags: string[];
  department: string;
  popularity: number;
  active: boolean;
}

interface QuestionFormProps {
  newQuestion: NewQuestion;
  setNewQuestion: React.Dispatch<React.SetStateAction<NewQuestion>>;
  currentTag: string;
  setCurrentTag: React.Dispatch<React.SetStateAction<string>>;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleAddQuestion: () => void;
  handleGenerateQuestions: () => void;
  isGenerating: boolean;
  questionTypes: QuestionType[];
  departments: Department[];
}

export function QuestionForm({
  newQuestion,
  setNewQuestion,
  currentTag,
  setCurrentTag,
  handleAddTag,
  handleRemoveTag,
  handleAddQuestion,
  handleGenerateQuestions,
  isGenerating,
  questionTypes,
  departments
}: QuestionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
        <CardDescription>Create a new engagement question manually or generate with AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter your question..."
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question Type</label>
              <Select 
                value={newQuestion.type} 
                onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={newQuestion.department} 
                onValueChange={(value) => setNewQuestion({...newQuestion, department: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <QuestionFormTags
            currentTag={currentTag}
            setCurrentTag={setCurrentTag}
            tags={newQuestion.tags}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="default"
          onClick={handleGenerateQuestions}
          disabled={isGenerating}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate AI Questions"}
        </Button>
        <Button onClick={handleAddQuestion} disabled={!newQuestion.text.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </CardFooter>
    </Card>
  );
}

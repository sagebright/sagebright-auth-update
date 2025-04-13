
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Stars, Search, Sparkles, Tag } from 'lucide-react';
import { QuestionCard } from './QuestionCard';

// Sample question data
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    text: "What's one small win you had this week that you're proud of?",
    type: "reflective",
    tags: ["reflective", "weekly-check-in"],
    department: "all",
    popularity: 4,
    active: true
  },
  {
    id: 2,
    text: "If you were a kitchen appliance, which one would you be and why?",
    type: "icebreaker",
    tags: ["icebreaker", "fun"],
    department: "all",
    popularity: 5,
    active: true
  },
  {
    id: 3,
    text: "What's one project you're excited about right now?",
    type: "team",
    tags: ["team", "projects"],
    department: "engineering",
    popularity: 3,
    active: true
  },
  {
    id: 4,
    text: "If you could improve one thing about our team meetings, what would it be?",
    type: "team",
    tags: ["team", "improvement"],
    department: "all",
    popularity: 2,
    active: false
  },
  {
    id: 5,
    text: "What was your favorite movie growing up?",
    type: "icebreaker",
    tags: ["icebreaker", "personal"],
    department: "all",
    popularity: 5,
    active: true
  },
];

// Question types with colors
const QUESTION_TYPES = [
  { value: "icebreaker", label: "Icebreaker", color: "bg-blue-100 text-blue-800" },
  { value: "reflective", label: "Reflective", color: "bg-purple-100 text-purple-800" },
  { value: "team", label: "Team", color: "bg-green-100 text-green-800" }
];

// Department options
const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
  { value: "operations", label: "Operations" }
];

export function QuestionBankEditor() {
  const [questions, setQuestions] = useState(SAMPLE_QUESTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "icebreaker",
    tags: [],
    department: "all",
    popularity: 0,
    active: true
  });
  const [currentTag, setCurrentTag] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || q.type === filterType;
    const matchesDepartment = filterDepartment === "all" || q.department === filterDepartment;
    
    return matchesSearch && matchesType && matchesDepartment;
  });

  // Handle adding a new question
  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) return;
    
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        ...newQuestion,
        popularity: 0,
        active: true
      }
    ]);
    
    // Reset the form
    setNewQuestion({
      text: "",
      type: "icebreaker",
      tags: [],
      department: "all",
      popularity: 0,
      active: true
    });
  };

  // Handle adding a tag to the new question
  const handleAddTag = () => {
    if (!currentTag.trim() || newQuestion.tags.includes(currentTag.trim())) return;
    
    setNewQuestion({
      ...newQuestion,
      tags: [...newQuestion.tags, currentTag.trim()]
    });
    
    setCurrentTag("");
  };

  // Handle removing a tag from the new question
  const handleRemoveTag = (tagToRemove) => {
    setNewQuestion({
      ...newQuestion,
      tags: newQuestion.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle generating questions with AI
  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a timeout
    setTimeout(() => {
      const generatedQuestions = [
        "What's a skill you've been wanting to learn but haven't had time for?",
        "If you could swap jobs with anyone in the company for a day, who would it be and why?",
        "What's something about your work style that most people don't know about?"
      ];
      
      // Add the generated questions to the list
      const newQuestions = generatedQuestions.map((text, i) => ({
        id: questions.length + i + 1,
        text,
        type: "reflective",
        tags: ["ai-generated", "reflective"],
        department: "all",
        popularity: 0,
        active: true
      }));
      
      setQuestions([...questions, ...newQuestions]);
      setIsGenerating(false);
    }, 2000);
  };

  // Get background color for question type badge
  const getTypeColor = (type) => {
    return QUESTION_TYPES.find(t => t.value === type)?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-row gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {QUESTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Question Creation */}
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
                    {QUESTION_TYPES.map((type) => (
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
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={!currentTag.trim()}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {newQuestion.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {newQuestion.tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">No tags added yet</span>
                )}
              </div>
            </div>
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
      
      {/* Question List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredQuestions.map((question) => (
          <QuestionCard 
            key={question.id} 
            question={question}
            onUpdate={(updatedQuestion) => {
              setQuestions(questions.map(q => 
                q.id === updatedQuestion.id ? updatedQuestion : q
              ));
            }}
            typeColor={getTypeColor(question.type)}
          />
        ))}
        
        {filteredQuestions.length === 0 && (
          <div className="col-span-2 p-8 border rounded-md text-center">
            <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No questions found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters, or add a new question.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

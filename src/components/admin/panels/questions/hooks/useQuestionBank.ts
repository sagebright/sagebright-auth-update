
import { useState } from 'react';
import { SAMPLE_QUESTIONS } from '../config/questionConfig';

interface Question {
  id: number;
  text: string;
  type: string;
  tags: string[];
  department: string;
  popularity: number;
  active: boolean;
}

interface NewQuestion {
  text: string;
  type: string;
  tags: string[];
  department: string;
  popularity: number;
  active: boolean;
}

export function useQuestionBank() {
  const [questions, setQuestions] = useState(SAMPLE_QUESTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [newQuestion, setNewQuestion] = useState<NewQuestion>({
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
  const handleRemoveTag = (tagToRemove: string) => {
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

  // Handle updating a question
  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
  };

  // Get background color for question type badge
  const getTypeColor = (type: string): string => {
    const questionTypes = [
      { value: "icebreaker", label: "Icebreaker", color: "bg-blue-100 text-blue-800" },
      { value: "reflective", label: "Reflective", color: "bg-purple-100 text-purple-800" },
      { value: "team", label: "Team", color: "bg-green-100 text-green-800" }
    ];
    return questionTypes.find(t => t.value === type)?.color || "bg-gray-100 text-gray-800";
  };

  return {
    questions,
    filteredQuestions,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterDepartment,
    setFilterDepartment,
    newQuestion,
    setNewQuestion,
    currentTag,
    setCurrentTag,
    isGenerating,
    handleAddQuestion,
    handleAddTag,
    handleRemoveTag,
    handleGenerateQuestions,
    handleUpdateQuestion,
    getTypeColor
  };
}

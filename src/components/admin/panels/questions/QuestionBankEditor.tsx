
import React, { useState } from 'react';
import { SearchAndFilters } from './filters/SearchAndFilters';
import { QuestionForm } from './creation/QuestionForm';
import { QuestionsList } from './display/QuestionsList';
import { QUESTION_TYPES, DEPARTMENTS, SAMPLE_QUESTIONS } from './config/questionConfig';

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

  // Handle updating a question
  const handleUpdateQuestion = (updatedQuestion) => {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <SearchAndFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        questionTypes={QUESTION_TYPES}
        departments={DEPARTMENTS}
      />
      
      {/* Question Creation */}
      <QuestionForm 
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
        handleAddTag={handleAddTag}
        handleRemoveTag={handleRemoveTag}
        handleAddQuestion={handleAddQuestion}
        handleGenerateQuestions={handleGenerateQuestions}
        isGenerating={isGenerating}
        questionTypes={QUESTION_TYPES}
        departments={DEPARTMENTS}
      />
      
      {/* Question List */}
      <QuestionsList 
        questions={filteredQuestions}
        onUpdate={handleUpdateQuestion}
        getTypeColor={getTypeColor}
      />
    </div>
  );
}

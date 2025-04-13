
import React from 'react';
import { SearchAndFilters } from './filters/SearchAndFilters';
import { QuestionForm } from './creation/QuestionForm';
import { QuestionsList } from './display/QuestionsList';
import { QUESTION_TYPES, DEPARTMENTS } from './config/questionConfig';
import { useQuestionBank } from './hooks/useQuestionBank';

export function QuestionBankEditor() {
  const {
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
  } = useQuestionBank();

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

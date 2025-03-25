
import React from 'react';
import { Target, Brain, MessageSquare } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const WhatEmployeesExperience = () => {
  return (
    <section className="py-20 bg-white" id="employees">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-headline font-dmSans font-bold mb-6">Onboarding that feels like a conversation — not a checklist.</h2>
          <p className="text-body font-sans text-gray-600">
            Sage acts like a helpful teammate who never gets tired of answering questions. It's always available, always personal, and always grounded in your company's unique values, tone, and expertise.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
              <Target className="h-7 w-7 text-sagebright-green" />
            </div>
            <h3 className="text-xl font-dmSans font-semibold mb-4">Helps new hires prioritize what matters most</h3>
            <p className="text-gray-600 font-sans">
              Sage helps employees focus on what's important right now, ensuring they don't get overwhelmed by too much information at once.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
              <Brain className="h-7 w-7 text-sagebright-green" />
            </div>
            <h3 className="text-xl font-dmSans font-semibold mb-4">Answers questions using your tools, resources, and knowledge bases</h3>
            <p className="text-gray-600 font-sans">
              Sage connects to your existing knowledge resources to provide accurate, company-specific answers to employee questions.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
              <MessageSquare className="h-7 w-7 text-sagebright-green" />
            </div>
            <h3 className="text-xl font-dmSans font-semibold mb-4">Encourages honest reflections — and empowers employees to share what's working</h3>
            <p className="text-gray-600 font-sans">
              Sage creates a safe space for feedback, helping new hires voice concerns and share insights on their own terms.
            </p>
          </div>
        </div>
        
        <div className="mt-16 mx-auto max-w-4xl rounded-xl overflow-hidden shadow-xl">
          <AspectRatio ratio={16/9} className="bg-sagebright-green/5">
            <img 
              src="/lovable-uploads/3dc82e16-06ba-488d-adb7-e767342c17d8.png" 
              alt="Ask Sage Interface - AI Assistant for Onboarding" 
              className="w-full h-full object-cover rounded-xl"
            />
          </AspectRatio>
          <div className="bg-white p-4 text-center">
            <p className="text-charcoal text-sm font-medium">Sage answers questions with the right level of detail at the right time</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatEmployeesExperience;

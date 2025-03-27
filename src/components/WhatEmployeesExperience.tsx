
import React from 'react';
import { Target, Brain, MessageSquare } from 'lucide-react';
import LazyImage from './ui/lazy-image';

const WhatEmployeesExperience = () => {
  return (
    <section className="py-20 bg-white" id="employees">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Side-by-side layout with adjusted ratio (40% text, 60% image) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 mb-16 items-center">
          {/* Left column - Text content (40%) */}
          <div className="flex flex-col justify-center md:col-span-2">
            <h2 className="text-headline font-dmSans font-bold mb-6">Onboarding that feels like a conversation — not a checklist.</h2>
            <p className="text-body font-sans text-gray-600">
              Sage acts like a helpful teammate who never gets tired of answering questions. It's always available, always personal, and always grounded in your company's unique values, tone, and expertise.
            </p>
          </div>
          
          {/* Right column - Screenshot (60%) */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 transition-transform duration-500 hover:shadow-card-hover md:col-span-3">
            <LazyImage 
              src="/lovable-uploads/dashboard-screenshot.webp" 
              alt="Sagebright AI dashboard showing personalized guidance"
              aspectRatio="16/9" 
              placeholderColor="#f8f9fa"
              objectFit="cover"
            />
            
            {/* Decorative background */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-sagebright-coral/5 to-sagebright-green/5 blur-2xl rounded-full"></div>
          </div>
        </div>
        
        {/* Cards Section - Grid below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
      </div>
    </section>
  );
};

export default WhatEmployeesExperience;

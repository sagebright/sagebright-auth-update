
import React from 'react';
import Navbar from '@/components/AlternateNavbar';
import Footer from '@/components/Footer';
import AskSageHero from '@/components/AskSageHero';
import { Button } from '@/components/ui/button';
import { MessageSquare, Target, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const AskSage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <AskSageHero />
        
        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-headline font-dmSans font-bold mb-6">Onboarding that feels like a conversation — not a checklist.</h2>
              <p className="text-body font-helvetica text-gray-600">
                Sage acts like a helpful teammate who never gets tired of answering questions. It's always available, always personal, and always grounded in your company's unique values, tone, and expertise.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                  <Target className="h-7 w-7 text-sagebright-green" />
                </div>
                <h3 className="text-xl font-dmSans font-semibold mb-4">Helps new hires prioritize what matters most</h3>
                <p className="text-gray-600 font-helvetica">
                  Sage helps employees focus on what's important right now, ensuring they don't get overwhelmed by too much information at once.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                  <Brain className="h-7 w-7 text-sagebright-green" />
                </div>
                <h3 className="text-xl font-dmSans font-semibold mb-4">Answers questions using your tools, resources, and knowledge bases</h3>
                <p className="text-gray-600 font-helvetica">
                  Sage connects to your existing knowledge resources to provide accurate, company-specific answers to employee questions.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="bg-sagebright-green/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                  <MessageSquare className="h-7 w-7 text-sagebright-green" />
                </div>
                <h3 className="text-xl font-dmSans font-semibold mb-4">Encourages honest reflections — and empowers employees to share what's working</h3>
                <p className="text-gray-600 font-helvetica">
                  Sage creates a safe space for feedback, helping new hires voice concerns and share insights on their own terms.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button asChild className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105">
                <Link to="/auth/signup">Request Access Today</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Demo Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-8 md:p-10">
                  <h2 className="text-2xl md:text-3xl font-dmSans font-bold text-charcoal mb-6">See how Sage can transform your employee experience</h2>
                  <p className="text-body font-helvetica text-gray-600 mb-8">
                    Watch a quick demo of how Sage interacts with employees, answering questions and providing guidance in a natural, conversational way.
                  </p>
                  
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl flex items-center justify-center mb-8">
                    <div className="text-center p-16">
                      <MessageSquare className="h-16 w-16 text-sagebright-green mx-auto mb-4" />
                      <p className="text-body font-helvetica text-charcoal">Demo Video Placeholder</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button asChild className="bg-sagebright-green hover:bg-sagebright-green/90 text-white text-cta font-dmSans rounded-md transition-transform duration-300 hover:scale-103 hover:brightness-105">
                      <Link to="/auth/signup">Schedule a Demo</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AskSage;


import React, { useEffect, useRef } from 'react';
import { Sparkles, Calendar, Lightbulb, UserRound } from 'lucide-react';

const HowSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    
    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      fadeElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  const steps = [
    {
      icon: <UserRound className="h-10 w-10 text-sagebright-green" />,
      title: "AI Makes It Personal",
      description: "Interactive guidance tailored to the employee's role and preferences"
    },
    {
      icon: <Sparkles className="h-10 w-10 text-sagebright-green" />,
      title: "Real-Time Q&A",
      description: "Employees can ask anything and get instant, company-specific answers"
    },
    {
      icon: <Calendar className="h-10 w-10 text-sagebright-green" />,
      title: "Ongoing Check-Ins",
      description: "Tracks progress, adapts to feedback, and refines recommendations"
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-sagebright-green" />,
      title: "Bigger Picture Insights",
      description: "Helps employees see how their work connects to the company's mission"
    }
  ];

  return (
    <section className="py-24 bg-white" id="how" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 p-text-spacing fade-in-section">
          <h2 className="text-headline font-dmSans font-bold mb-6 text-sagebright-green"> 
            Your AI-Powered Guide for the First Days, Weeks, and Beyond
          </h2>
          <p className="text-body font-sans text-gray-600">
          Sagebright doesn't just provide information—it acts as a mentor. By learning about each employee's role, challenges, and work style, it personalizes their onboarding experience, helping them integrate faster and feel more connected from day one.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-sagebright-accent/50 -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full fade-in-section"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center items-center w-20 h-20 mb-6 mx-auto bg-sagebright-green/10 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-subheading font-dmSans font-medium mb-4 text-center text-sagebright-green">{step.title}</h3>
                <p className="text-body font-sans text-center text-gray-600 flex-grow mb-6">{step.description}</p>
                <div className="hidden lg:flex justify-center mt-auto">
                  <span className="w-10 h-10 rounded-full bg-sagebright-green text-white flex items-center justify-center font-semibold text-lg">
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;

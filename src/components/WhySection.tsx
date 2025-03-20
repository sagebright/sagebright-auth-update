
import React, { useEffect, useRef } from 'react';
import { Timer, ShieldAlert, Wallet, Battery } from 'lucide-react';

const WhySection = () => {
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

  const problems = [
    {
      icon: <Timer className="h-10 w-10 text-sagebright-gold" />,
      title: "Time-Consuming Processes",
      description: "HR teams struggle to provide personalized support at scale."
    },
    {
      icon: <ShieldAlert className="h-10 w-10 text-sagebright-gold" />,
      title: "Inconsistent Experiences",
      description: "Managers don't have the bandwidth to guide every new hire effectively"
    },
    {
      icon: <Wallet className="h-10 w-10 text-sagebright-gold" />,
      title: "Costly Mistakes",
      description: "Poor onboarding leads to higher turnover and significantly reduces new hire productivity"
    },
    {
      icon: <Battery className="h-10 w-10 text-sagebright-gold" />,
      title: "Information Overwhelm",
      description: "New hires feel drained and lost in a sea of information"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-sagebright-accent/5" id="why" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 p-text-spacing fade-in-section">
          <h2 className="text-headline font-dmSans font-bold mb-6 text-sagebright-green">A Better Start Leads to Better Work</h2>
          <p className="text-body font-sans text-gray-600">
            Companies struggle with onboarding that's manual, disjointed, and fails to provide new hires with what they need when they need it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col fade-in-section"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="mb-6 bg-sagebright-accent/20 p-4 rounded-full inline-block">
                {problem.icon}
              </div>
              <h3 className="text-subheading font-dmSans font-medium mb-3 text-gray-800">{problem.title}</h3>
              <p className="text-body font-sans text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;

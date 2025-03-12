
import React from 'react';
import { Sparkles, Clock, Users, FileText } from 'lucide-react';

const HowSection = () => {
  const steps = [
    {
      icon: <FileText className="h-10 w-10 text-sagebright-green" />,
      title: "Connect Your Resources",
      description: "Easily integrate your existing knowledge base, handbooks, and documentation into our platform."
    },
    {
      icon: <Sparkles className="h-10 w-10 text-sagebright-green" />,
      title: "AI Organizes Everything",
      description: "Our AI processes and structures your information into a personalized learning journey."
    },
    {
      icon: <Users className="h-10 w-10 text-sagebright-green" />,
      title: "Tailored Onboarding",
      description: "Each new hire receives a customized onboarding experience based on their role and team."
    },
    {
      icon: <Clock className="h-10 w-10 text-sagebright-green" />,
      title: "Continuous Adaptation",
      description: "The platform learns from feedback and evolves, keeping onboarding materials fresh and relevant."
    }
  ];

  return (
    <section className="py-20" id="how">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How 
            <span className="text-sagebright-green">sage</span>
            <span className="text-sagebright-gold">bright</span> Works
          </h2>
          <p className="text-xl text-gray-600">
            Our AI platform transforms your existing resources into an intelligent onboarding system that adapts to each new hire.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-center items-center w-16 h-16 mb-6 mx-auto bg-sagebright-green/10 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
                <div className="hidden lg:flex justify-center mt-6 items-end">
                  <span className="w-8 h-8 rounded-full bg-sagebright-green text-white flex items-center justify-center font-semibold">
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

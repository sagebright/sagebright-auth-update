
import React from 'react';
import { Timer, ShieldAlert, Wallet, BrainCircuit } from 'lucide-react';

const WhySection = () => {
  const problems = [
    {
      icon: <Timer className="h-10 w-10 text-sagebright-gold" />,
      title: "Time-Consuming Processes",
      description: "HR teams struggle to provide personalized support at scale."
    },
    {
      icon: <ShieldAlert className="h-10 w-10 text-sagebright-gold" />,
      title: "Inconsistent Experiences",
      description: "Managers don't have the bandwidth to guide every new hire effectively."
    },
    {
      icon: <Wallet className="h-10 w-10 text-sagebright-gold" />,
      title: "Costly Mistakes",
      description: "Poor onboarding leads to higher turnover and significantly reduces new hire productivity."
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-sagebright-gold" />,
      title: "Information Overload",
      description: "Employees feel lost in a sea of information."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-sagebright-accent/5" id="why">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sagebright-green">A Better Start Leads to Better Work</h2>
          <p className="text-xl text-gray-600">
            Companies struggle with onboarding that's manual, disjointed, and fails to provide new hires with what they need when they need it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="mb-6 bg-sagebright-accent/20 p-4 rounded-full inline-block">
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{problem.title}</h3>
              <p className="text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;

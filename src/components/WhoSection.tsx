
import React from 'react';
import { Building, Users, GraduationCap } from 'lucide-react';

const WhoSection = () => {
  const audiences = [
    {
      icon: <Building className="h-16 w-16 text-sagebright-gold" />,
      title: "HR Leaders",
      description: "Transform your onboarding from a time sink into a strategic advantage. Reduce administrative workload while improving new hire outcomes."
    },
    {
      icon: <Users className="h-16 w-16 text-sagebright-green" />,
      title: "Team Managers",
      description: "Stop reinventing the wheel for each new team member. Ensure consistent, high-quality onboarding without the manual effort."
    },
    {
      icon: <GraduationCap className="h-16 w-16 text-sagebright-gold" />,
      title: "New Employees",
      description: "Get exactly what you need to succeed, when you need it. Less overwhelm, more clarity, and a smoother transition into your new role."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50" id="who">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Who <span className="text-sagebright-green">sage</span><span className="text-sagebright-gold">bright</span> Is For
          </h2>
          <p className="text-xl text-gray-600">
            Our platform benefits everyone involved in the onboarding process, from HR teams to new hires themselves.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-6">{audience.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{audience.title}</h3>
              <p className="text-gray-600">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoSection;

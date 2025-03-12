
import React from 'react';
import { TrendingUp, Network, GraduationCap } from 'lucide-react';

const WhoSection = () => {
  const audiences = [
    {
      icon: <TrendingUp className="h-16 w-16 text-sagebright-green" />,
      title: "Fast-Growing Companies",
      description: "Onboard new hires without slowing down"
    },
    {
      icon: <Users className="h-16 w-16 text-sagebright-green" />,
      title: "People-First Companies",
      description: "Build stronger engagement from day one"
    },
    {
      icon: <Network className="h-16 w-16 text-sagebright-green" />,
      title: "Remote & Hybrid Teams",
      description: "Provide seamless, high-touch onboarding from anywhere"
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
           Sagebright is designed for companies that believe their people are their greatest advantage. If you want to create an onboarding experience that inspires, we'd love to have you in our beta.
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

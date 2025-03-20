
import React, { useEffect, useRef } from 'react';
import { TrendingUp, Network, GraduationCap, Users as UsersIcon } from 'lucide-react';

const WhoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const audiencesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    audiencesRef.current.forEach((audience) => {
      if (audience) observer.observe(audience);
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      audiencesRef.current.forEach((audience) => {
        if (audience) observer.unobserve(audience);
      });
    };
  }, []);

  const audiences = [
    {
      icon: <TrendingUp className="h-16 w-16 text-sagebright-green" />,
      title: "Fast-Growing Companies",
      description: "Onboard new hires without slowing down"
    },
    {
      icon: <UsersIcon className="h-16 w-16 text-sagebright-green" />,
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
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-white to-gray-50 section-animate" 
      id="who"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 p-text-spacing section-animate">
          <h2 className="text-headline font-dmSans font-bold mb-6 text-sagebright-green">
            Who <span className="text-sagebright-green">sagebright</span> Is For
          </h2>
          <p className="text-body font-sans text-gray-600">
           Sagebright is designed for companies that believe their people are their greatest advantage. If you want to create an onboarding experience that inspires, we'd love to have you in our beta.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              ref={el => audiencesRef.current[index] = el}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center section-animate hover:scale-[1.01] transition-transform"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-center mb-6 transition-transform hover:scale-[1.05] duration-300">{audience.icon}</div>
              <h3 className="text-subheading font-dmSans font-medium mb-4">{audience.title}</h3>
              <p className="text-body font-sans text-gray-600">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoSection;

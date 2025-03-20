
import React, { useEffect, useRef } from 'react';
import { TrendingUp, Network, GraduationCap, Users as UsersIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const WhoSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const audiencesRef = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

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
      icon: <TrendingUp className="h-12 w-12 md:h-16 md:w-16 text-sagebright-green" />,
      title: "Fast-Growing Companies",
      description: "Onboard new hires without slowing down"
    },
    {
      icon: <UsersIcon className="h-12 w-12 md:h-16 md:w-16 text-sagebright-coral" />,
      title: "People-First Companies",
      description: "Build stronger engagement from day one"
    },
    {
      icon: <Network className="h-12 w-12 md:h-16 md:w-16 text-sagebright-navy" />,
      title: "Remote & Hybrid Teams",
      description: "Provide seamless, high-touch onboarding from anywhere"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="bg-white section-animate py-16 md:py-24" 
      id="who"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20 p-text-spacing section-animate text-block">
          <h2 className="text-3xl md:text-headline font-dmSans font-bold mb-6 md:mb-8 text-sagebright-green">
            Who <span className="text-sagebright-coral">sagebright</span> Is For
          </h2>
          <p className="text-lg md:text-body font-sans text-gray-600">
           Sagebright is designed for companies that believe their people are their greatest advantage. If you want to create an onboarding experience that inspires, we'd love to have you in our beta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              ref={el => audiencesRef.current[index] = el}
              className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center section-animate hover:scale-[1.01] transition-transform hover:border-sagebright-gold/50"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-center mb-6 md:mb-8 transition-transform hover:scale-[1.05] duration-300">{audience.icon}</div>
              <h3 className="text-xl md:text-subheading font-dmSans font-medium mb-4 md:mb-6">{audience.title}</h3>
              <p className="text-base md:text-body font-sans text-gray-600">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoSection;

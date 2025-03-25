
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhySection from '@/components/WhySection';
import HowSection from '@/components/HowSection';
import WhoSection from '@/components/WhoSection';
import WaitlistSection from '@/components/WaitlistSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WhySection />
        <HowSection />
        <WhoSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

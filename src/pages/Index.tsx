
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhatEmployeesExperience from '@/components/WhatEmployeesExperience';
import WhatAdminsGet from '@/components/WhatAdminsGet';
import HowItWorks from '@/components/HowItWorks';
import DesignedToFeelHuman from '@/components/DesignedToFeelHuman';
import WaitlistSection from '@/components/WaitlistSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WhatEmployeesExperience />
        <WhatAdminsGet />
        <HowItWorks />
        <DesignedToFeelHuman />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

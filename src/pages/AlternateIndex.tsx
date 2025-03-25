
import React from 'react';
import Navbar from '@/components/AlternateNavbar';
import AlternateHeroSection from '@/components/AlternateHeroSection';
import WhatEmployeesExperience from '@/components/WhatEmployeesExperience';
import WhatAdminsGet from '@/components/WhatAdminsGet';
import HowItWorks from '@/components/HowItWorks';
import DesignedToFeelHuman from '@/components/DesignedToFeelHuman';
import WaitlistSection from '@/components/WaitlistSection';
import Footer from '@/components/Footer';

const AlternateIndex = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AlternateHeroSection />
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

export default AlternateIndex;

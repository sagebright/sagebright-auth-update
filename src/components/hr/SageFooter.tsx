
import React from 'react';
import { Separator } from '@/components/ui/separator';

const SageFooter = () => {
  return (
    <div className="mt-12 mb-2 text-center">
      <Separator className="mb-8" />
      <div className="max-w-2xl mx-auto">
        <img
          src="/lovable-uploads/sage_avatar.png"
          alt="Sage Assistant"
          className="h-10 w-10 mx-auto rounded-full mb-4"
        />
        <p className="text-sm text-charcoal/70 font-roboto italic">
          "Sagebright helps you see what matters without compromising privacy or overwhelming you with data. We're here to make onboarding clearer, kinder, and more effective for everyone."
        </p>
        <p className="text-xs mt-4 text-charcoal/50">
          © {new Date().getFullYear()} Sagebright — Respecting privacy while improving onboarding
        </p>
      </div>
    </div>
  );
};

export default SageFooter;


import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const SageFooter = () => {
  return (
    <div className="mt-12 mb-2 text-center">
      <Separator className="mb-8" />
      <div className="max-w-2xl mx-auto">
        <img
          src="/lovable-uploads/sage_avatar.png"
          alt="Sage Assistant"
          className="h-12 w-12 mx-auto rounded-full mb-4"
        />
        <p className="text-sm text-charcoal/70 font-roboto italic mb-4">
          "Sagebright helps you see what matters without compromising privacy or overwhelming you with data. We're here to make onboarding clearer, kinder, and more effective for everyone."
        </p>
        
        <Button asChild variant="outline" className="mx-auto mb-6">
          <Link to="/ask-sage" className="flex items-center gap-2">
            <MessageCircle size={16} />
            Chat with Sage
          </Link>
        </Button>
        
        <p className="text-xs mt-4 text-charcoal/50">
          © {new Date().getFullYear()} Sagebright — Respecting privacy while improving onboarding
        </p>
      </div>
    </div>
  );
};

export default SageFooter;

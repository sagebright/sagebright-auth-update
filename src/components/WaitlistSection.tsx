
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const WaitlistSection = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the signup data into the Beta Signups table
      const { error } = await supabase
        .from('Beta Signups')
        .insert([
          { 
            email,
            first_name: firstName,
            last_name: lastName,
            company
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Success!",
        description: "You've been added to our beta waitlist. We'll be in touch soon.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Something went wrong",
        description: "There was an error adding you to the waitlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="bg-sagebright-green/10" id="waitlist">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="text-center mb-12 p-text-spacing text-block">
                <h2 className="text-headline font-dmSans font-bold mb-6">Join Our Beta Waitlist</h2>
                <p className="text-body font-sans text-gray-600">
                  Be among the first to transform your onboarding experience with Sagebright.
                </p>
              </div>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      placeholder="First Name"
                      className="py-6 px-4 text-body font-sans"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      className="py-6 px-4 text-body font-sans"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="py-6 px-4 text-body font-sans"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Company (optional)"
                    className="py-6 px-4 text-body font-sans"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <div className="flex justify-center mt-8">
                    <Button 
                      type="submit" 
                      className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white py-6 px-8 text-cta font-dmSans"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          Join Waitlist <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 text-center font-sans mt-4">
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-6">
                    <div className="bg-sagebright-green/10 p-4 rounded-full">
                      <Check className="h-10 w-10 text-sagebright-green" />
                    </div>
                  </div>
                  <h3 className="text-subheading font-dmSans font-medium mb-4">Thank You!</h3>
                  <p className="text-body font-sans text-gray-600">
                    We've added you to our waitlist. We'll be in touch soon with more information about the beta program.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;

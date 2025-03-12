
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
    <section className="py-20 bg-sagebright-green/10" id="waitlist">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Beta Waitlist</h2>
                <p className="text-lg text-gray-600">
                  Be among the first to transform your onboarding experience with sagebright.ai.
                </p>
              </div>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Alex"
                      className="py-6 px-4"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Walker"
                      className="py-6 px-4"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="alex@walkercatering.com"
                    className="py-6 px-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Walker Catering (optional)"
                    className="py-6 px-4"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <div className="flex justify-center mt-6">
                    <Button 
                      type="submit" 
                      className="bg-sagebright-green hover:bg-sagebright-green/90 text-white py-6 px-8"
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
                  <p className="text-sm text-gray-500 text-center">
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-sagebright-green/10 p-4 rounded-full">
                      <Check className="h-10 w-10 text-sagebright-green" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                  <p className="text-gray-600">
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

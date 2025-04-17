import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Check } from 'lucide-react';

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
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Please enter your name",
        description: "First name and last name are required.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          first_name: firstName,
          last_name: lastName,
          company
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit to waitlist');
      }
      
      const emailResponse = await fetch('/api/send-waitlist-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          company
        }),
      });
      
      if (!emailResponse.ok) {
        console.warn('Confirmation email could not be sent, but user was added to the waitlist');
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
              <div className="text-center mb-8 p-text-spacing">
                <h2 className="text-headline font-dmSans font-bold mb-4">Request Early Access</h2>
                <p className="text-body font-sans text-gray-600">
                  We're currently inviting select teams to work with Sage. If you want to build a better onboarding experience, we'd love to hear from you.
                </p>
              </div>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="First Name"
                      className="py-6 px-4 text-body font-sans"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      className="py-6 px-4 text-body font-sans"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
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
                  <div className="flex justify-center mt-6">
                    <Button 
                      type="submit" 
                      className="bg-sagebright-coral hover:bg-sagebright-coral/90 text-white py-6 px-8 text-cta font-dmSans"
                      loading={isSubmitting}
                      loadingText="Submitting..."
                    >
                      Request access <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 text-center font-sans">
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
                  <h3 className="text-subheading font-dmSans font-medium mb-2">Thank You!</h3>
                  <p className="text-body font-sans text-gray-600 mb-4">
                    We've added you to our early access list. We'll be in touch with info on introducing Sage to your team.
                  </p>
                  <p className="text-sm text-sagebright-green font-medium">
                    Check your inbox for a confirmation email from the Sagebright team.
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

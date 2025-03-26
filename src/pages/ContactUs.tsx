
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactForm from "@/components/contact/ContactForm";

const ContactUs = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 pt-20"> {/* Added pt-20 for top padding */}
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
          <ContactHeader 
            title="Reach Out Anytime"
            description="Whether it's feedback, curiosity, or just a quick hello—drop us a note and we'll be in touch."
          />
          
          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;

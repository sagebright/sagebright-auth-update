
import React from "react";
import AlternateNavbar from "@/components/AlternateNavbar";
import Footer from "@/components/Footer";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactForm from "@/components/contact/ContactForm";

const ContactUs = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <AlternateNavbar />
      
      <main className="flex-1 bg-gray-50">
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


import React from "react";

type ContactHeaderProps = {
  title: string;
  description: string;
};

const ContactHeader = ({ title, description }: ContactHeaderProps) => {
  return (
    <div className="mb-12 text-center">
      <h1 className="font-helvetica mb-4 text-4xl font-bold text-charcoal">{title}</h1>
      <p className="mx-auto max-w-2xl text-lg text-charcoal/80">
        {description}
      </p>
    </div>
  );
};

export default ContactHeader;

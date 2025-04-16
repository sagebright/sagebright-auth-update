
import React from 'react';

interface WelcomeMessageProps {
  voiceParam?: string | null;
  userName?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ voiceParam, userName }) => {
  // Determine the appropriate greeting based on voice parameter
  const getGreeting = () => {
    if (voiceParam === 'onboarding') {
      return "Hi there! I'm Sage, your onboarding assistant. How can I help you get started today?";
    } else if (voiceParam === 'troubleshooting') {
      return "Hello! I'm Sage, here to help you troubleshoot any issues you're facing. What can I assist with?";
    } else {
      return `Hi${userName ? ` ${userName}` : ''}! I'm Sage, your AI assistant. How can I help you today?`;
    }
  };

  return (
    <div className="p-4 border border-sagebright-green/20 rounded-lg bg-sagebright-green/5 mb-6">
      <h3 className="text-lg font-medium text-sagebright-green mb-2">Welcome to Sage</h3>
      <p className="text-charcoal">{getGreeting()}</p>
      <p className="text-sm text-gray-600 mt-2">
        I can answer questions about your onboarding, company policies, team members, and more.
      </p>
    </div>
  );
};

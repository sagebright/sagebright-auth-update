
import React from 'react';
import { useVoiceParamState } from '@/hooks/use-voice-param';

interface WelcomeMessageProps {
  voiceParam?: string | null;
  userName?: string;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ voiceParam, userName }) => {
  // Get detailed voice param state for enhanced data
  const voiceParamState = useVoiceParamState();
  
  // Determine the appropriate greeting based on voice parameter
  const getGreeting = () => {
    // Use voiceParam from props, which should match voiceParamState.currentVoice
    const voice = voiceParam || 'default';
    
    if (voice === 'onboarding') {
      return "Hi there! I'm Sage, your onboarding assistant. How can I help you get started today?";
    } else if (voice === 'troubleshooting') {
      return "Hello! I'm Sage, here to help you troubleshoot any issues you're facing. What can I assist with?";
    } else if (voice === 'coach') {
      return `Welcome${userName ? ` ${userName}` : ''}. I'm Sage, your executive coach. What would you like to work on today?`;
    } else if (voice === 'analyst') {
      return `Hello${userName ? ` ${userName}` : ''}. I'm Sage, ready to analyze data and identify patterns for you.`;
    } else if (voice === 'companion') {
      return `Hi${userName ? ` ${userName}` : ''}. I'm Sage, here to provide support and companionship through your workday.`;
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
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-1 bg-gray-100 rounded text-xs text-gray-700">
          Voice: {voiceParam} | Source: {voiceParamState.source} | 
          Valid: {voiceParamState.isValid ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
};


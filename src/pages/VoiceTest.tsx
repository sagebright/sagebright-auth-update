
import React from 'react';
import { VoiceDebugger } from '@/components/VoiceDebugger';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VoiceTestPage = () => {
  const navigate = useNavigate();
  
  const testWithVoice = (voice: string) => {
    navigate(`/ask-sage?voice=${voice}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Voice Parameter Test Suite</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Variations</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => testWithVoice('default')}>Test Default Voice</Button>
          <Button onClick={() => testWithVoice('skeptic')}>Test Skeptic Voice</Button>
          <Button onClick={() => testWithVoice('director')}>Test Director Voice</Button>
          <Button onClick={() => testWithVoice('companion')}>Test Companion Voice</Button>
          <Button variant="outline" onClick={() => testWithVoice('invalid-voice')}>Test Invalid Voice</Button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg">
        <VoiceDebugger />
      </div>
    </div>
  );
};

export default VoiceTestPage;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReflectionFormProps {
  onSubmit: (data: ReflectionData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface ReflectionData {
  wellResponse: string;
  unclearResponse: string;
  shareWithManager: boolean;
}

export const ReflectionForm: React.FC<ReflectionFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [wellResponse, setWellResponse] = useState('');
  const [unclearResponse, setUnclearResponse] = useState('');
  const [shareWithManager, setShareWithManager] = useState(false);
  
  const handleSubmit = () => {
    onSubmit({
      wellResponse,
      unclearResponse,
      shareWithManager
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="well-response" className="block text-sm font-medium text-charcoal mb-1">
          What's one thing that's gone well this week?
        </label>
        <Textarea
          id="well-response"
          value={wellResponse}
          onChange={(e) => setWellResponse(e.target.value)}
          placeholder="I feel like I've made progress with..."
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="unclear-response" className="block text-sm font-medium text-charcoal mb-1">
          Is anything feeling unclear?
        </label>
        <Textarea
          id="unclear-response"
          value={unclearResponse}
          onChange={(e) => setUnclearResponse(e.target.value)}
          placeholder="I'm still trying to understand..."
          className="w-full"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="share-manager"
          checked={shareWithManager}
          onChange={(e) => setShareWithManager(e.target.checked)}
          className="h-4 w-4 text-sagebright-green rounded border-gray-300 focus:ring-sagebright-green"
        />
        <label htmlFor="share-manager" className="ml-2 block text-sm text-gray-700">
          Would you like to share this with your manager?
        </label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-sagebright-gold hover:bg-sagebright-gold/90 text-charcoal"
          loading={isSubmitting}
          loadingText="Saving..."
        >
          Save Reflection
        </Button>
      </div>
    </div>
  );
};

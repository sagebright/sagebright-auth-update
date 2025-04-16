
import { useState, useCallback } from 'react';
import { ReflectionData } from '@/components/ask-sage/ReflectionForm';
import { toast } from '@/components/ui/use-toast';

export const useReflectionHandler = () => {
  const [showReflection, setShowReflection] = useState(false);

  const handleReflectionSubmit = useCallback((data: ReflectionData) => {
    console.log('Reflection submitted:', data);
    setShowReflection(false);
  }, []);

  return {
    showReflection,
    setShowReflection,
    handleReflectionSubmit
  };
};

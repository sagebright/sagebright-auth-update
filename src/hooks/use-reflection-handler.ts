
import { useState, useCallback } from 'react';
import { ReflectionData } from '@/types/reflection';
import { toast } from '@/components/ui/use-toast';

export const useReflectionHandler = () => {
  const [showReflection, setShowReflection] = useState(false);

  const handleReflectionSubmit = useCallback((data: ReflectionData) => {
    console.log('Reflection submitted:', data);
    toast({
      title: "Reflection saved",
      description: "Your reflection has been saved successfully.",
    });
    setShowReflection(false);
  }, []);

  return {
    showReflection,
    setShowReflection,
    handleReflectionSubmit
  };
};

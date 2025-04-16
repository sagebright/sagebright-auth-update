
import { useCallback } from 'react';

export const useQuestionSelection = (
  sendMessageToSage: (content: string) => Promise<void>
) => {
  const handleSelectQuestion = useCallback((question: string) => {
    console.log("Selected suggested question:", question);
    sendMessageToSage(question);
  }, [sendMessageToSage]);

  return { handleSelectQuestion };
};

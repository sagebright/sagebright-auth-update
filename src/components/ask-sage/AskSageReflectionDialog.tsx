
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReflectionForm } from './ReflectionForm';
import { ReflectionData } from '@/types/reflection';

interface AskSageReflectionDialogProps {
  showReflection: boolean;
  setShowReflection: (show: boolean) => void;
  handleReflectionSubmit: (data: ReflectionData) => void;
  isMobile: boolean;
}

export const AskSageReflectionDialog: React.FC<AskSageReflectionDialogProps> = ({
  showReflection,
  setShowReflection,
  handleReflectionSubmit,
  isMobile,
}) => {
  return (
    <Dialog open={showReflection} onOpenChange={setShowReflection}>
      <DialogContent className={isMobile ? "w-full h-[90vh] rounded-t-lg p-4 max-w-full pt-6" : ""}>
        <DialogHeader>
          <DialogTitle className="text-xl font-helvetica text-charcoal">Want to check in with yourself?</DialogTitle>
          <DialogDescription>
            Taking a moment to reflect can help your onboarding journey.
          </DialogDescription>
        </DialogHeader>
        <ReflectionForm
          onSubmit={handleReflectionSubmit}
          onCancel={() => setShowReflection(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

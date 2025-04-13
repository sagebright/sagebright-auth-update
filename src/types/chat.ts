
import { User } from "@supabase/supabase-js";

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'sage';
  timestamp: Date;
  avatar_url?: string;
  liked?: boolean;
  disliked?: boolean;
}

export interface ChatHookReturn {
  messages: Message[];
  suggestedQuestions: string[];
  showReflection: boolean;
  setShowReflection: (show: boolean) => void;
  handleSendMessage: (content: string) => Promise<void>;
  handleFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  isLoading: boolean;
  isRecoveringOrg: boolean;
}

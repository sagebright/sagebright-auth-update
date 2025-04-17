
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  isLoading?: boolean;
  error?: boolean;
  metadata?: {
    source?: string;
    context?: string;
  };
}

export interface ChatSession {
  id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface ChatContext {
  userId: string;
  orgId: string;
  sessionId?: string;
}

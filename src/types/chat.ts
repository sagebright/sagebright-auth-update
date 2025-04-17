
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sender?: 'user' | 'sage' | 'system'; // Adding for backward compatibility
  timestamp: number;
  isLoading?: boolean;
  error?: boolean;
  avatar_url?: string; // Adding for backward compatibility
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

// Add SageContext interface that was referenced in imports
export interface SageContext {
  userId: string;
  orgId: string;
  orgSlug?: string;
  userContext?: any;
  orgContext?: any;
  voice?: string;
}

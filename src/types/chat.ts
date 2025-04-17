
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sender: 'user' | 'sage' | 'system'; // Adding as a required field
  timestamp: number;
  isLoading?: boolean;
  error?: boolean;
  avatar_url?: string;
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

export interface SageContext {
  userId: string;
  orgId: string;
  orgSlug?: string;
  userContext?: any;
  orgContext?: any;
  voice?: string;
  
  // Adding missing properties needed by the codebase
  user?: any;
  org?: any;
  messages?: any[];
  _meta?: {
    userContextSource?: string;
    orgContextSource?: string;
    hydratedAt?: string;
    voiceConfig?: any;
    timeout?: boolean;
    error?: string;
    timestamp?: string;
  };
}

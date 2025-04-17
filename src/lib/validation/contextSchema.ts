
import * as z from 'zod';
import { SageContext } from '@/types/chat';

/**
 * Schema validation for OpenAI request context
 */
const OpenAIRequestSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  context: z.object({
    userId: z.string(),
    orgId: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string().optional(),
    }),
    org: z.object({
      id: z.string(),
      name: z.string().optional(),
    }),
    messages: z.array(z.any()).optional().default([])
  }),
  voice: z.string().optional().default('default')
});

/**
 * Validates the OpenAI request parameters
 */
export function validateOpenAIRequest(request: { 
  question: string, 
  context: SageContext, 
  voice?: string 
}) {
  try {
    OpenAIRequestSchema.parse(request);
    return true;
  } catch (error) {
    console.error('OpenAI Request Validation Error:', error);
    throw error;
  }
}


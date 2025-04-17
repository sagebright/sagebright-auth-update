
import * as z from 'zod';
import { SageContext } from '@/types/chat';

/**
 * Base schema for user objects 
 */
const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
}).nullable();

/**
 * Base schema for organization objects
 */
const OrgSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
}).nullable();

/**
 * Schema validation for Sage context
 */
const SageContextSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  user: UserSchema,
  org: OrgSchema,
  messages: z.array(z.any()).optional().default([])
});

/**
 * Schema validation for OpenAI request context
 */
const OpenAIRequestSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  context: z.object({
    userId: z.string(),
    orgId: z.string(),
    user: UserSchema.optional(),
    org: OrgSchema.optional(),
    messages: z.array(z.any()).optional().default([])
  }),
  voice: z.string().optional().default('default')
});

/**
 * Conditionally applies strict validation based on environment
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @param options Configuration options
 */
function validateWithEnvironmentCheck<T>(
  schema: z.ZodSchema<T>, 
  data: any, 
  options: {
    skipInDevelopment?: boolean,
    contextName: string
  } = { skipInDevelopment: true, contextName: 'Schema' }
): boolean {
  // In development mode, be permissive if configured to skip
  if (process.env.NODE_ENV === 'development' && options.skipInDevelopment) {
    console.log(`🧪 Development mode: Skipping strict ${options.contextName} validation`);
    return true;
  }
  
  try {
    schema.parse(data);
    return true;
  } catch (error) {
    console.error(`${options.contextName} Validation Error:`, error);
    throw error;
  }
}

/**
 * Validates the Sage context parameters
 */
export function validateSageContext(context: any, skipInDevelopment = true): boolean {
  return validateWithEnvironmentCheck(SageContextSchema, context, {
    skipInDevelopment,
    contextName: 'Sage Context'
  });
}

/**
 * Validates the OpenAI request parameters
 */
export function validateOpenAIRequest(request: { 
  question: string, 
  context: SageContext, 
  voice?: string 
}): boolean {
  return validateWithEnvironmentCheck(OpenAIRequestSchema, request, {
    skipInDevelopment: false, // Always validate OpenAI requests
    contextName: 'OpenAI Request'
  });
}

/**
 * Validate just the core identifiers for context building
 */
export function validateContextIdentifiers(userId: string, orgId: string): boolean {
  const IdentifierSchema = z.object({
    userId: z.string().min(1, "userId cannot be empty"),
    orgId: z.string().min(1, "orgId cannot be empty"),
  });
  
  return validateWithEnvironmentCheck(
    IdentifierSchema, 
    { userId, orgId },
    { 
      skipInDevelopment: true,
      contextName: 'Context Identifiers' 
    }
  );
}


import { z } from "zod";

/**
 * Zod schema for organization context validation
 */
export const OrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  mission: z.string().optional(),
  values: z.array(z.string()).optional(),
  tools_and_systems: z.string().optional(),
  onboarding_processes: z.string().optional(),
  glossary: z.record(z.string()).optional(),
  policies: z.record(z.string()).optional(),
  known_pain_points: z.array(z.string()).optional(),
  learning_culture: z.string().optional(),
  leadership_style: z.string().optional(),
  executives: z.array(
    z.object({
      name: z.string(),
      title: z.string(),
      background: z.string().optional()
    })
  ).optional(),
  history: z.string().optional(),
  culture: z.string().optional(),
  department: z.string().optional(),
}).strict().refine(data => {
  // Must have at least one descriptive field beyond the name
  return Object.keys(data).length > 1;
}, {
  message: "Organization context must contain at least one descriptive field beyond name"
});

/**
 * Zod schema for user context validation
 */
export const UserSchema = z.object({
  user_id: z.string().optional(),
  org_id: z.string().optional(),
  role: z.string().min(1, "User role is required"),
  department: z.string().optional(),
  goals: z.record(z.string()).optional(),
  personality_notes: z.string().optional(),
  manager_name: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  working_hours: z.string().optional(),
  learning_style: z.string().optional(),
  introvert_extrovert: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  start_date: z.string().optional()
}).strict().refine(data => {
  // Must have role plus at least one other meaningful field
  return Object.keys(data).length > 1;
}, {
  message: "User context must contain role and at least one other field"
});

/**
 * Zod schema for the complete Sage context object
 */
export const SageContextSchema = z.object({
  org: OrganizationSchema.nullable(),
  user: UserSchema.nullable(),
  userId: z.string(),
  orgId: z.string(),
  messages: z.array(z.string()).optional(),
}).refine(data => {
  // Either both org and user are present, or both are null
  return (data.org !== null && data.user !== null) || 
         (data.org === null && data.user === null);
}, {
  message: "Both org and user contexts must be present or both must be null"
});

/**
 * Zod schema for OpenAI request parameters
 */
export const OpenAIRequestSchema = z.object({
  question: z.string().min(1, "Question is required"),
  context: SageContextSchema,
  voice: z.string().default("default"),
});

/**
 * Type definitions derived from the schemas
 */
export type ValidOrganization = z.infer<typeof OrganizationSchema>;
export type ValidUser = z.infer<typeof UserSchema>;
export type ValidSageContext = z.infer<typeof SageContextSchema>;
export type ValidOpenAIRequest = z.infer<typeof OpenAIRequestSchema>;

/**
 * Validates the context object using Zod schema
 * 
 * @param context - The context object to validate
 * @returns Validated context or throws detailed Zod error
 */
export function validateSageContext(context: unknown): ValidSageContext {
  try {
    // Log that validation is being attempted
    console.log("🔍 Validating Sage context structure");
    
    // Perform the validation
    const validatedContext = SageContextSchema.parse(context);
    
    // Log validation success
    console.log("✅ Context validation successful");
    console.log("Context structure:", {
      hasOrgContext: !!validatedContext.org,
      hasUserContext: !!validatedContext.user,
      orgFields: validatedContext.org ? Object.keys(validatedContext.org) : [],
      userFields: validatedContext.user ? Object.keys(validatedContext.user) : []
    });
    
    return validatedContext;
  } catch (error) {
    // Log validation failure with detailed error information
    console.group("❌ Context validation failed");
    console.error("Validation errors:", error);
    
    // Attempt to extract and format Zod error messages for better readability
    if (error.errors) {
      console.error("Validation details:", 
        error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
      );
    }
    
    // Log the context structure that failed validation
    console.error("Invalid context structure:", context);
    console.groupEnd();
    
    throw error;
  }
}

/**
 * Validates the complete OpenAI request parameters
 * 
 * @param params - The request parameters to validate
 * @returns Validated parameters or throws detailed Zod error
 */
export function validateOpenAIRequest(params: unknown): ValidOpenAIRequest {
  try {
    console.log("🔍 Validating OpenAI request parameters");
    const validatedParams = OpenAIRequestSchema.parse(params);
    console.log("✅ OpenAI request validation successful");
    return validatedParams;
  } catch (error) {
    console.group("❌ OpenAI request validation failed");
    console.error("Validation errors:", error);
    
    if (error.errors) {
      console.error("Validation details:", 
        error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
      );
    }
    
    console.error("Invalid request parameters:", params);
    console.groupEnd();
    
    throw error;
  }
}

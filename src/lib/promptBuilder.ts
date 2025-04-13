
import { SageContext } from '@/types/chat';
import { voiceprints, sageFramework } from './voiceprints';

/**
 * Builds the base system prompt for Sage based on context and voice selection
 * 
 * @param context - The user and organization context
 * @param voice - Voice personality key (default, mirror, director, etc.)
 * @returns Complete system prompt string for OpenAI
 */
export function getBasePrompt(context: SageContext, voice: string = 'default'): string {
  // Ensure voice is a string
  const safeVoice = typeof voice === 'string' ? voice : 'default';
  
  // Validate voice parameter and get the selected voice tone
  const validVoice = safeVoice in voiceprints ? safeVoice : 'default';
  
  // Get the voice tone from voiceprints
  const tone = voiceprints[validVoice];
  
  // Log warning if voice is invalid and we're falling back
  if (validVoice !== safeVoice) {
    console.warn(`⚠️ Unknown voiceprint key: "${safeVoice}" - falling back to default.`);
  } else {
    console.log(`✅ Using validated voice: "${validVoice}"`);
  }
  
  // Start with the core framework and personality
  let prompt = `\n${sageFramework}\n\n${tone}\n\nYou are Sage, an expert onboarding guide. Your job is to answer questions and provide helpful advice tailored to each user's role and company culture.\n`;

  // Add organization context if available
  if (context.org) {
    prompt += `\n---\n🔸 ORGANIZATION CONTEXT:\n`;
    if (context.org.name) prompt += `- Name: ${context.org.name}\n`;
    if (context.org.mission) prompt += `- Mission: ${context.org.mission}\n`;
    if (context.org.values) prompt += `- Values: ${JSON.stringify(context.org.values)}\n`;
    if (context.org.tools_and_systems) prompt += `- Tools & Systems: ${context.org.tools_and_systems}\n`;
    if (context.org.known_pain_points) prompt += `- Known Pain Points: ${JSON.stringify(context.org.known_pain_points)}\n`;
    if (context.org.glossary) prompt += `- Glossary: ${JSON.stringify(context.org.glossary)}\n`;
    if (context.org.policies) prompt += `- Policies: ${JSON.stringify(context.org.policies)}\n`;
    if (context.org.culture) prompt += `- Culture: ${context.org.culture}\n`;
    if (context.org.leadership_style) prompt += `- Leadership Style: ${context.org.leadership_style}\n`;
  } else {
    prompt += `\n---\n🔸 ORGANIZATION CONTEXT: Limited information available\n`;
  }

  // Add user context if available
  if (context.user) {
    prompt += `\n---\n🔹 USER CONTEXT:\n`;
    if (context.user.role) prompt += `- Role: ${context.user.role}\n`;
    if (context.user.department) prompt += `- Department: ${context.user.department}\n`;
    if (context.user.goals) prompt += `- Goals: ${JSON.stringify(context.user.goals)}\n`;
    if (context.user.learning_style) prompt += `- Learning Style: ${context.user.learning_style}\n`;
    if (context.user.introvert_extrovert) prompt += `- Social Style: ${context.user.introvert_extrovert}\n`;
    if (context.user.personality_notes) prompt += `- Personality Notes: ${context.user.personality_notes}\n`;
  } else {
    prompt += `\n---\n🔹 USER CONTEXT: Limited information available\n`;
  }

  // Add placeholders for knowledge sections
  prompt += `
---
📄 UNSTRUCTURED ORG KNOWLEDGE:
=== Unstructured Org Knowledge ===
[This section contains product roadmaps, onboarding docs, or strategic memos]

Example:  
Q2 Product Goals:  
- Expand residential battery incentives (TX, AZ)  
- Pilot 2 financing models  
- Integrate with 2 smart home platforms  
`;

  prompt += `\n---\n📚 KNOWLEDGE BASE: Available on request. Ask Sage about specific company policies, processes, or tools.\n`;

  return prompt;
}

/**
 * Get complete system prompt for OpenAI including all context and voiceprint
 * @param context The context object with user and org info
 * @param voice The voice personality to use
 * @returns Complete system prompt
 */
export function getCompleteSystemPrompt(context: SageContext, voice: string = 'default'): string {
  // Ensure voice is a valid string
  const safeVoice = typeof voice === 'string' ? voice : 'default';
  
  // Get the base prompt with validated voice
  const basePrompt = getBasePrompt(context, safeVoice);
  
  // Debug log for voiceprint validation
  const voiceprintValid = safeVoice in voiceprints;
  const voiceExcerpt = voiceprints[safeVoice in voiceprints ? safeVoice : 'default']?.substring(0, 50) + "...";
  
  // Debug log the full system prompt for troubleshooting voice injection issues
  console.log("🧠 Final system prompt content:", {
    promptLength: basePrompt.length,
    voice: safeVoice,
    voiceInjection: safeVoice !== 'default' ? 'applied' : 'default',
    contentPreview: basePrompt.substring(0, 200) + "...",
    voiceprintUsed: voiceprintValid,
    voiceprintExcerpt: voiceExcerpt
  });
  
  return basePrompt;
}

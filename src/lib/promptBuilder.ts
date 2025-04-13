
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
  const timestamp = new Date().toISOString();
  
  // Get the selected voice tone or fall back to default
  const tone = voiceprints[voice] || voiceprints['default'];
  
  // Log warning if voice is invalid and we're falling back
  if (!voiceprints[voice]) {
    console.warn(`⚠️ [${timestamp}] Unknown voiceprint key: ${voice} - falling back to default.`);
  }
  
  console.log(`🎙️ [${timestamp}] Prompt builder received voice parameter:`, {
    voice,
    exists: voice in voiceprints,
    voiceprintLength: tone ? tone.length : 0,
    allVoices: Object.keys(voiceprints)
  });
  
  // Start with the core framework and personality
  let prompt = `${sageFramework}\n\n${tone}\n\nYou are Sage, an expert onboarding guide. Your job is to answer questions and provide helpful advice tailored to each user's role and company culture.\n`;

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

  // Add unstructured knowledge placeholder
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

  // Add knowledge base placeholder
  prompt += `\n---\n📚 KNOWLEDGE BASE: Available on request. Ask Sage about specific company policies, processes, or tools.\n`;

  // Log the final prompt for debugging
  console.log(`🧠 [${timestamp}] Final system prompt for voice "${voice}"`, { 
    promptLength: prompt.length,
    voice,
    hasVoiceprintContent: !!tone,
    voiceprintContentStart: tone.substring(0, 50) + "..."
  });
  
  return prompt;
}

/**
 * Get complete system prompt for OpenAI including all context and voiceprint
 * @param context The context object with user and org info
 * @param voice The voice personality to use
 * @returns Complete system prompt
 */
export function getCompleteSystemPrompt(context: SageContext, voice: string = 'default'): string {
  const timestamp = new Date().toISOString();
  console.log(`📝 [${timestamp}] Building complete system prompt with voice:`, voice);
  
  const basePrompt = getBasePrompt(context, voice);
  const finalPrompt = basePrompt;
  
  // Debug log the full system prompt for troubleshooting voice injection issues
  console.log(`🧠 [${timestamp}] Final system prompt content:`, {
    promptLength: finalPrompt.length,
    voice,
    voiceInjection: voice !== 'default' ? 'applied' : 'default',
    contentPreview: finalPrompt.substring(0, 200) + "...",
    voiceprintUsed: voiceprints[voice] ? true : false,
    voiceprintExcerpt: voiceprints[voice]?.substring(0, 50) + "..." || 'N/A'
  });
  
  return finalPrompt;
}

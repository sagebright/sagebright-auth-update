
// src/lib/api.ts

import { voiceprints, sageFramework } from './voiceprints';

export async function callOpenAI({
  question,
  context,
  voice = 'default',
}: {
  question: string;
  context: {
    org?: any;
    user?: any;
    userId?: string;
    orgId?: string;
  };
  voice?: string;
}): Promise<string> {
  console.log("🎤 Using voice:", voice);
  console.log("🔑 Checking OpenAI key:", !!import.meta.env.VITE_OPENAI_KEY);
  console.log("📝 Context received:", {
    hasOrgData: !!context.org,
    hasUserData: !!context.user,
    userId: context.userId,
    orgId: context.orgId
  });

  if (!import.meta.env.VITE_OPENAI_KEY) {
    console.error("OpenAI API key is missing or invalid");
    throw new Error("OpenAI API key is missing. Please check your environment configuration.");
  }

  // Additional validation before proceeding
  if (!context.orgId) {
    console.error("Missing context.orgId in callOpenAI", context);
    throw new Error("Organization context is missing. Please contact support.");
  }

  const tone = voiceprints[voice] || voiceprints['default'];
  const systemPrompt = generateSystemPrompt(context, tone);

  try {
    console.log("Sending request to OpenAI API");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("OpenAI API error:", errorData || response.statusText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");

    return data.choices?.[0]?.message?.content ?? "No response from Sage.";
  } catch (error) {
    console.error("Error in callOpenAI:", error);
    throw error;
  }
}

function generateSystemPrompt(
  context: {
    org?: any;
    user?: any;
    userId?: string;
    orgId?: string;
  },
  tone: string
): string {
  const { org, user } = context;

  let prompt = `${sageFramework}\n\n${tone}\n\nYou are Sage, an expert onboarding guide. Your job is to answer questions and provide helpful advice tailored to each user's role and company culture.\n`;

  if (org) {
    prompt += `\n---\n🔸 ORGANIZATION CONTEXT:\n`;
    if (org.name) prompt += `- Name: ${org.name}\n`;
    if (org.mission) prompt += `- Mission: ${org.mission}\n`;
    if (org.values) prompt += `- Values: ${JSON.stringify(org.values)}\n`;
    if (org.tools_and_systems) prompt += `- Tools & Systems: ${org.tools_and_systems}\n`;
    if (org.known_pain_points) prompt += `- Known Pain Points: ${JSON.stringify(org.known_pain_points)}\n`;
    if (org.glossary) prompt += `- Glossary: ${JSON.stringify(org.glossary)}\n`;
    if (org.policies) prompt += `- Policies: ${JSON.stringify(org.policies)}\n`;
    if (org.culture) prompt += `- Culture: ${org.culture}\n`;
    if (org.leadership_style) prompt += `- Leadership Style: ${org.leadership_style}\n`;
  } else {
    console.warn("⚠️ No organization data available for prompt");
    prompt += `\n---\n🔸 ORGANIZATION CONTEXT: Limited information available\n`;
  }

  if (user) {
    prompt += `\n---\n🔹 USER CONTEXT:\n`;
    if (user.role) prompt += `- Role: ${user.role}\n`;
    if (user.department) prompt += `- Department: ${user.department}\n`;
    if (user.goals) prompt += `- Goals: ${JSON.stringify(user.goals)}\n`;
    if (user.learning_style) prompt += `- Learning Style: ${user.learning_style}\n`;
    if (user.introvert_extrovert) prompt += `- Social Style: ${user.introvert_extrovert}\n`;
    if (user.personality_notes) prompt += `- Personality Notes: ${user.personality_notes}\n`;
  } else {
    console.warn("⚠️ No user data available for prompt");
    prompt += `\n---\n🔹 USER CONTEXT: Limited information available\n`;
  }
  console.log("🧠 Final system prompt created");

  return prompt;
}

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
  console.log("🔑 VITE_OPENAI_KEY:", import.meta.env.VITE_OPENAI_KEY?.slice(0, 8));

  const tone = voiceprints[voice] || voiceprints['default'];
  const systemPrompt = generateSystemPrompt(context, tone);

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

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenAI API error:", data);
    throw new Error("Sage had trouble responding.");
  }

  return data.choices?.[0]?.message?.content ?? "No response from Sage.";
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
  }

  if (user) {
    prompt += `\n---\n🔹 USER CONTEXT:\n`;
    if (user.role) prompt += `- Role: ${user.role}\n`;
    if (user.department) prompt += `- Department: ${user.department}\n`;
    if (user.goals) prompt += `- Goals: ${JSON.stringify(user.goals)}\n`;
    if (user.learning_style) prompt += `- Learning Style: ${user.learning_style}\n`;
    if (user.introvert_extrovert) prompt += `- Social Style: ${user.introvert_extrovert}\n`;
    if (user.personality_notes) prompt += `- Personality Notes: ${user.personality_notes}\n`;
  }

  return prompt;
}
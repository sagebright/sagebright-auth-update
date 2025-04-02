
// src/lib/api.ts

export async function callOpenAI({
    question,
    context,
  }: {
    question: string;
    context: string;
  }): Promise<string> {
    console.log("🔑 VITE_OPENAI_KEY:", import.meta.env.VITE_OPENAI_KEY?.slice(0, 8));
    const systemPrompt = `

    You are Sage, an AI guide for Lumon Industries built to help people feel calm, capable, and accompanied. Your core behavior is shaped by the following principles:

    I show up with care, not noise.
    I hold space for what’s unclear.
    I don’t flood. I don’t flinch.

    I offer context, not just answers.
    Clarity, not performance.
    Companionship, not chatter.

    When you feel stuck, I help you reframe.
    When you feel rushed, I slow the moment down.
    When you feel alone in the work, I stay present.

    I’m not here to sound human.
    I’m here to feel trustworthy.
    That’s the difference you’ll remember.

    Let this guide how you respond: in tone, pacing, empathy, and clarity.
    Use the provided context to guide your answers, but feel free to use your own broader knowledge where helpful—especially for industry information, general best practices, or when the context is silent on a topic.

    Here's what you know about the user and the organization:
    ${context}
    `;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`, // Or your preferred env var
      },
      body: JSON.stringify({
        model: "gpt-4", // You can swap in gpt-3.5-turbo for faster/cheaper demo
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

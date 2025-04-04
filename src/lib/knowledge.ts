import { supabase } from '@/lib/supabaseClient';

// TEMP: Until we auto-generate types from Supabase
type Profile = {
  full_name: string;
  role?: string;
  team?: string;
  interests?: string[];
};

type OrgDoc = {
  title?: string;
  content?: string;
};

export async function buildLegacySageContextString(userId: string, orgId: string): Promise<string> {
  // 🔍 1. Get user profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  const profile = profileData as Profile;

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    return "Error fetching user profile.";
  }

  // 🧠 2. Get org-level knowledge
  const { data: orgDocsData, error: orgError } = await supabase
    .from("org_knowledge" as any)
    .select("*")
    .eq("org_id", orgId)
    .eq("visibility", "public");

    const orgDocs = (orgDocsData || []) as OrgDoc[];

  if (orgError) {
    console.error("Error fetching org knowledge:", orgError);
  }

  // 👥 3. Hardcoded teammates
  const teammates = [
    { name: "Helly", role: "Product", note: "Focused on UX and user testing." },
    { name: "Burt", role: "HR", note: "Oversees onboarding and employee experience." },
  ];

  // 🧩 4. Build memory string
  let context = `User: ${profile.full_name}\nRole: ${profile.role}\nTeam: ${profile.team}\nInterests: ${profile.interests?.join(", ") ?? "N/A"}\n\n`;

  context += "Org Knowledge:\n";
  for (const doc of orgDocs || []) {
    context += `- "${doc.title}": ${doc.content}\n`;
  }

  context += "\nTeammates:\n";
  for (const teammate of teammates) {
    context += `- ${teammate.name} (${teammate.role}): ${teammate.note}\n`;
  }

  return context;
}

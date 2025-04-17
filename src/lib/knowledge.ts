
import { fetchAuth } from '@/lib/backendAuth';

export async function buildLegacySageContextString(userId: string, orgId: string): Promise<string> {
  try {
    const authData = await fetchAuth();
    
    if (!authData?.user) {
      console.error("Error fetching user data");
      return "Error fetching user profile.";
    }

    let context = `User: ${authData.user.id}\nRole: ${authData.user.role}\n\n`;
    
    if (authData.org) {
      context += `Organization: ${authData.org.slug}\n`;
    }

    return context;
  } catch (error) {
    console.error("Error building context:", error);
    return "Error building context string.";
  }
}

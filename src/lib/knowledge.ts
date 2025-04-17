
import { fetchAuth } from '@/lib/backendAuth';

// This file needs significant refactoring since it relied heavily on Supabase
// For now, we'll implement a basic version using the auth endpoint
export async function buildLegacySageContextString(userId: string, orgId: string): Promise<string> {
  try {
    const authData = await fetchAuth();
    
    if (!authData?.user) {
      console.error("Error fetching user data");
      return "Error fetching user profile.";
    }

    // Build basic context with available data
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

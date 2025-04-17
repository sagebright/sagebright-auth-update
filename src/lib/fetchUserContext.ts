
import { fetchAuth } from '@/lib/backendAuth';

/**
 * Fetches user-level context for a given user ID.
 * Enhanced with better error handling and debugging.
 *
 * @param userId - User ID to fetch context for
 * @returns User context object or null if not found
 */
export async function fetchUserContext(userId: string) {
  console.log("📡 fetchUserContext triggered", { userId });
  
  if (!userId) {
    console.warn("⚠️ Cannot fetch user context: No userId provided");
    return null;
  }

  console.log(`[fetchUserContext] Attempting to fetch context for userId: ${userId}`);

  try {
    const authData = await fetchAuth();
    
    if (!authData || !authData.user) {
      console.warn(`⚠️ No user context found for userId: ${userId}`);
      return null;
    }
    
    // Format the data to match the original schema
    const userData = {
      id: authData.user.id,
      user_id: authData.user.id, // Keep compatibility with existing code
      role: authData.user.role,
    };

    console.log(`✅ Successfully retrieved user context for userId: ${userId}`, {
      hasContextId: !!userData.id,
      dataFieldCount: Object.keys(userData).length
    });
    
    return userData;
  } catch (err) {
    console.error('❌ Exception in fetchUserContext:', err);
    return null;
  }
}

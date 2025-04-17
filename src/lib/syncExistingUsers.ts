
import { fetchAuth } from '@/lib/backendAuth';

export async function syncExistingUsers(): Promise<string[]> {
  try {
    console.log('🔄 Checking user sync status');
    
    const authData = await fetchAuth();
    
    if (!authData?.user) {
      throw new Error('No user data available');
    }
    
    return ['User sync check completed successfully'];
  } catch (error) {
    console.error('❌ Error checking user sync:', error);
    return ['User sync status check failed'];
  }
}

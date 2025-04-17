
// Temporary compatibility layer for transitioning from Supabase
// This helps prevent build errors during the migration process
// Files using this should eventually be refactored to use backendAuth.ts instead.

/**
 * This is a temporary placeholder for Supabase auth operations
 * that will throw errors if actually used.
 * 
 * All code should be migrated to use the new backendAuth.ts instead.
 */
class AuthClient {
  auth = {
    getUser: async () => {
      console.error('AuthClient.auth.getUser() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    },
    
    getSession: async () => {
      console.error('AuthClient.auth.getSession() called - should use backendAuth.ts instead');
      return { data: { session: null }, error: null };
    },
    
    refreshSession: async () => {
      console.error('AuthClient.auth.refreshSession() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    },
    
    updateUser: async () => {
      console.error('AuthClient.auth.updateUser() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    },
    
    onAuthStateChange: () => {
      console.error('AuthClient.auth.onAuthStateChange() called - should use backendAuth.ts instead');
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    
    signInWithPassword: async () => {
      console.error('AuthClient.auth.signInWithPassword() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    },
    
    signOut: async () => {
      console.error('AuthClient.auth.signOut() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    },
    
    resetPasswordForEmail: async () => {
      console.error('AuthClient.auth.resetPasswordForEmail() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    },
    
    signUp: async () => {
      console.error('AuthClient.auth.signUp() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    },
    
    signInWithOAuth: async () => {
      console.error('AuthClient.auth.signInWithOAuth() called - should use backendAuth.ts instead');
      return { data: null, error: new Error('Not implemented - use backendAuth.ts instead') };
    }
  };
  
  // Handle all from() table operations with flexible method chaining
  from(_table: string) {
    console.error(`AuthClient.from() called - should use backend API instead`);
    
    // Create a flexible chainable object that can handle any method chain pattern
    const chain = {
      select: (_columns?: string) => chain,
      insert: (_data: any, _options?: any) => Promise.resolve({ data: null, error: new Error('Not implemented') }),
      update: (_data: any) => chain,
      eq: (_column: string, _value: any) => chain,
      neq: (_column: string, _value: any) => chain,
      gt: (_column: string, _value: any) => chain,
      lt: (_column: string, _value: any) => chain,
      gte: (_column: string, _value: any) => chain,
      lte: (_column: string, _value: any) => chain,
      is: (_column: string, _value: any) => chain,
      in: (_column: string, _values: any[]) => chain,
      contains: (_column: string, _value: any) => chain,
      containedBy: (_column: string, _values: any[]) => chain,
      range: (_column: string, _from: any, _to: any) => chain,
      textSearch: (_column: string, _query: string) => chain,
      like: (_column: string, _pattern: string) => chain,
      ilike: (_column: string, _pattern: string) => chain,
      filter: (_column: string, _operator: string, _value: any) => chain,
      not: (_column: string, _operator: string, _value: any) => chain,
      match: (_query: any) => chain,
      or: (_query: string, _options: any) => chain,
      limit: (_count: number) => chain,
      order: (_column: string, _options: any) => chain,
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (callback: (value: any) => any) => Promise.resolve({ data: null, error: null }).then(callback),
      catch: (callback: (error: any) => any) => Promise.resolve({ data: null, error: null }).catch(callback),
    };
    
    return chain;
  }
  
  functions = {
    invoke: async (_functionName: string, _options?: any) => {
      console.error('AuthClient.functions.invoke() called - should use backend API instead');
      return { data: null, error: null };
    }
  };
}

export const supabase = new AuthClient();

export async function checkAuth() {
  try {
    // Import from the real auth client
    const { checkAuth: realCheckAuth } = await import('./backendAuth');
    return realCheckAuth();
  } catch (err) {
    console.error('Error checking auth:', err);
    return false;
  }
}

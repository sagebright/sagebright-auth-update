
// This is a placeholder file to satisfy imports while we migrate away from deprecated APIs
// This file will be removed once all references are updated to use the new API structure

export const deprecatedWarning = (functionName: string) => {
  console.warn(`Warning: ${functionName} is deprecated and will be removed in a future version`);
};

export const deprecatedFunction = (name: string) => {
  deprecatedWarning(name);
  return async () => {
    console.error(`${name} was called but is no longer implemented`);
    throw new Error(`${name} is deprecated and no longer available`);
  };
};

// Placeholder exports to satisfy imports
export const fetchSupabaseUser = deprecatedFunction('fetchSupabaseUser');
export const getSupabaseUserProfile = deprecatedFunction('getSupabaseUserProfile');
export const getSupabaseClient = deprecatedFunction('getSupabaseClient');

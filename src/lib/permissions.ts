
import { User } from '@supabase/supabase-js';

/**
 * Check if user has a specific role
 * @param user The user object from auth context
 * @param role The role to check for
 */
export function hasRole(
  user: any, 
  role: 'admin' | 'user' | 'moderator' | string
): boolean {
  if (!user) return false;
  
  // First check the currentUser metadata which comes from our backend
  if (user.role === role) {
    return true;
  }
  
  // Then check the user_metadata from supabase auth
  if (user.user_metadata && user.user_metadata.role === role) {
    return true;
  }
  
  return false;
}

/**
 * Check if user is an organization admin
 * @param user The user object from auth context
 */
export function isOrgAdmin(user: any): boolean {
  if (!user) return false;
  
  if (user.org_role === 'admin') {
    return true;
  }
  
  if (user.user_metadata && user.user_metadata.org_role === 'admin') {
    return true;
  }
  
  return hasRole(user, 'admin');
}

/**
 * Check if user is a super admin (platform-wide admin)
 * @param user The user object from auth context
 */
export function isSuperAdmin(user: any): boolean {
  if (!user) return false;
  
  if (user.role === 'super_admin') {
    return true;
  }
  
  if (user.user_metadata && user.user_metadata.role === 'super_admin') {
    return true;
  }
  
  return false;
}

/**
 * Check if user can edit content
 * @param user The user object from auth context
 */
export function canEdit(user: any): boolean {
  if (!user) return false;
  
  // Super admins and org admins can edit
  if (isSuperAdmin(user) || isOrgAdmin(user)) {
    return true;
  }
  
  // Users with explicit edit permission can edit
  if (user.permissions && user.permissions.includes('edit')) {
    return true;
  }
  
  return false;
}

/**
 * Check if user can access specific content
 * @param user The user object from auth context
 * @param resource The resource being accessed
 */
export function canAccess(user: any, resource: any): boolean {
  if (!user || !resource) return false;
  
  // Super admins can access everything
  if (isSuperAdmin(user)) {
    return true;
  }
  
  // Org admins can access their org's resources
  if (isOrgAdmin(user) && user.orgId === resource.org_id) {
    return true;
  }
  
  // Users can access resources specifically assigned to them
  if (resource.user_id === user.id) {
    return true;
  }
  
  return false;
}

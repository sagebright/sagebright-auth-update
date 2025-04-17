
export type Permission = 'read' | 'write' | 'admin';

export function checkPermission(userRole: string, requiredPermission: Permission): boolean {
  const permissionLevels: Record<string, number> = {
    'read': 1,
    'write': 2,
    'admin': 3
  };

  const rolePermissions: Record<string, Permission> = {
    'user': 'read',
    'editor': 'write',
    'admin': 'admin'
  };

  const userPermissionLevel = permissionLevels[rolePermissions[userRole] || 'read'];
  const requiredPermissionLevel = permissionLevels[requiredPermission];

  return userPermissionLevel >= requiredPermissionLevel;
}

// Add missing functions referenced in other files
export function hasRole(user: any, role: string): boolean {
  return user?.role === role;
}

export function isOrgAdmin(user: any): boolean {
  return user?.role === 'admin';
}

export function isSuperAdmin(user: any): boolean {
  return user?.role === 'super_admin';
}

export function canEdit(user: any, resource: any): boolean {
  if (isSuperAdmin(user) || isOrgAdmin(user)) return true;
  return user?.id === resource?.creator_id;
}

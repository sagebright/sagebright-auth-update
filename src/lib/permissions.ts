
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

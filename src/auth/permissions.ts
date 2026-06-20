export const PERMISSIONS = {
  AUTH_LOGIN: 'auth.login',
  COURSE_MANAGE: 'course.manage',
  ASSIGNMENT_MANAGE: 'assignment.manage',
  SUBMISSION_UPLOAD: 'submission.upload',
  JOB_ANALYZE: 'job.analyze',
  REPORT_VIEW_OWN_SCOPE: 'report.view_own_scope',
  REPORT_EXPORT: 'report.export',
  ADMIN_USER_MANAGE: 'admin.user_manage',
  ADMIN_SCORING_CONFIG: 'admin.scoring_config',
  ADMIN_AUDIT_LOG: 'admin.audit_log',
  ADMIN_METADATA_PROVIDER: 'admin.metadata_provider',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLES = {
  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT',
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_GROUPS = {
  AUTHENTICATED: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT],
  ACADEMIC_STAFF: [ROLES.ADMIN, ROLES.LECTURER],
  ADMIN_ONLY: [ROLES.ADMIN],
} as const;

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active?: boolean;
  permissions?: string[];
}

const ROLE_PERMISSIONS: Record<string, PermissionCode[]> = {
  LECTURER: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.COURSE_MANAGE,
    PERMISSIONS.ASSIGNMENT_MANAGE,
    PERMISSIONS.SUBMISSION_UPLOAD,
    PERMISSIONS.JOB_ANALYZE,
    PERMISSIONS.REPORT_VIEW_OWN_SCOPE,
    PERMISSIONS.REPORT_EXPORT,
  ],
  ADMIN: [
    PERMISSIONS.AUTH_LOGIN,
    PERMISSIONS.COURSE_MANAGE,
    PERMISSIONS.ASSIGNMENT_MANAGE,
    PERMISSIONS.SUBMISSION_UPLOAD,
    PERMISSIONS.JOB_ANALYZE,
    PERMISSIONS.REPORT_VIEW_OWN_SCOPE,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.ADMIN_USER_MANAGE,
    PERMISSIONS.ADMIN_SCORING_CONFIG,
    PERMISSIONS.ADMIN_AUDIT_LOG,
    PERMISSIONS.ADMIN_METADATA_PROVIDER,
  ],
  STUDENT: [PERMISSIONS.AUTH_LOGIN],
};

export function normalizeRole(role?: string | null) {
  return String(role || '').trim().toUpperCase();
}

export function getPermissionsForRole(role?: string | null) {
  return ROLE_PERMISSIONS[normalizeRole(role)] || [];
}

export function getUserPermissions(user?: AuthUser | null) {
  if (!user) return [];
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions;
  }
  return getPermissionsForRole(user.role);
}

export function storeAuthUser(user: AuthUser) {
  const normalizedUser = {
    ...user,
    permissions: getUserPermissions(user),
  };
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  return normalizedUser;
}

export function getStoredAuthUser(): AuthUser | null {
  const rawUser = localStorage.getItem('user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

export function hasAnyPermission(user: AuthUser | null, requiredPermissions: readonly string[] = []) {
  if (requiredPermissions.length === 0) return true;
  const userPermissions = new Set(getUserPermissions(user));
  return requiredPermissions.some((permission) => userPermissions.has(permission));
}

export function hasAnyRole(user: AuthUser | null, requiredRoles: readonly string[] = []) {
  if (requiredRoles.length === 0) return true;
  const userRole = normalizeRole(user?.role);
  return requiredRoles.map(normalizeRole).includes(userRole);
}

export function canAccess(
  user: AuthUser | null,
  requiredPermissions: readonly string[] = [],
  requiredRoles: readonly string[] = [],
) {
  return hasAnyRole(user, requiredRoles) && hasAnyPermission(user, requiredPermissions);
}

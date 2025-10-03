/**
 * Role management utilities for Kandra platform
 */

export const USER_ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin'
};

export const ROLE_ROUTES = {
  [USER_ROLES.STUDENT]: '/dokarti',
  [USER_ROLES.COMPANY]: '/company/dashboard',
  [USER_ROLES.ADMIN]: '/admin/dashboard'
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.STUDENT]: [
    'browse_jobs',
    'apply_for_jobs',
    'manage_applications',
    'view_profile',
    'edit_profile'
  ],
  [USER_ROLES.COMPANY]: [
    'post_jobs',
    'manage_job_posts',
    'view_applications',
    'manage_company_profile',
    'view_analytics'
  ],
  [USER_ROLES.ADMIN]: [
    'manage_users',
    'manage_companies',
    'manage_jobs',
    'view_system_analytics',
    'moderate_content',
    'system_configuration'
  ]
};

/**
 * Get user role from stored user data or JWT token
 * @param {Object} user - Optional user object (for backward compatibility)
 * @returns {string} - User role
 */
export const getUserRole = (user) => {
  // If user object is passed (Clerk compatibility), try to get role from it
  if (user?.publicMetadata?.role) {
    return user.publicMetadata.role;
  }
  
  // Get from stored user data (JWT login)
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      if (userData?.role) {
        // Normalize backend roles to frontend roles
        const role = userData.role.toLowerCase();
        switch (role) {
          case 'etudiant':
            return USER_ROLES.STUDENT;
          case 'entreprise':
            return USER_ROLES.COMPANY;
          case 'admin':
            return USER_ROLES.ADMIN;
          default:
            return role;
        }
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
    }
  }
  
  // Fallback to localStorage (temporary solution)
  const tempRole = localStorage.getItem('tempUserRole');
  if (tempRole) {
    return tempRole;
  }
  
  // Default to student
  return USER_ROLES.STUDENT;
};

/**
 * Check if user has specific permission
 * @param {Object} user - Clerk user object
 * @param {string} permission - Permission to check
 * @returns {boolean} - Whether user has permission
 */
export const hasPermission = (user, permission) => {
  const role = getUserRole(user);
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

/**
 * Get default route for user role
 * @param {Object} user - Clerk user object
 * @returns {string} - Default route for user's role
 */
export const getDefaultRoute = (user) => {
  const role = getUserRole(user);
  return ROLE_ROUTES[role] || ROLE_ROUTES[USER_ROLES.STUDENT];
};

/**
 * Check if user can access a specific route
 * @param {Object} user - Clerk user object
 * @param {string} route - Route to check
 * @returns {boolean} - Whether user can access route
 */
export const canAccessRoute = (user, route) => {
  const role = getUserRole(user);
  
  // Admin can access everything
  if (role === USER_ROLES.ADMIN) return true;
  
  // Role-specific route access
  const routePermissions = {
    '/dokarti': [USER_ROLES.STUDENT],
    '/etudiant/*': [USER_ROLES.STUDENT],
    '/company/*': [USER_ROLES.COMPANY],
    '/admin/*': [USER_ROLES.ADMIN]
  };
  
  for (const [routePattern, allowedRoles] of Object.entries(routePermissions)) {
    if (route.match(routePattern.replace('*', '.*'))) {
      return allowedRoles.includes(role);
    }
  }
  
  // Allow access to general authenticated routes
  return true;
};

/**
 * Check if user is authenticated (has valid JWT token)
 * @returns {boolean} - Whether user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get current user data
 * @returns {Object|null} - User data or null
 */
export const getCurrentUser = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
    }
  }
  return null;
};

/**
 * Clear authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tempUserRole'); // Legacy cleanup
};

/**
 * Get user's display name
 * @returns {string} - User's display name
 */
export const getUserDisplayName = () => {
  const user = getCurrentUser();
  if (user) {
    return `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email || 'User';
  }
  return 'User';
};

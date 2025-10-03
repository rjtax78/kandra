import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const RoleProtectedRoute = ({ children, allowedRoles = [], fallbackRoute }) => {
  const { user, userRole, isLoading, isLoggedIn, getRoleBasedPath } = useAuth();

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">Loading...</p>
            <p className="text-xs text-gray-500 mt-1">Checking access permissions</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize roles for comparison
  const normalizedUserRole = userRole?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());
  
  // Map database roles to frontend roles for comparison
  const roleMap = {
    'etudiant': 'student',
    'entreprise': 'company',
    'admin': 'admin'
  };
  
  const mappedUserRole = roleMap[normalizedUserRole] || normalizedUserRole;

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const hasAccess = normalizedAllowedRoles.includes(normalizedUserRole) || 
                     normalizedAllowedRoles.includes(mappedUserRole) ||
                     normalizedUserRole === 'admin'; // Admin has access to everything
    
    if (!hasAccess) {
      // Use provided fallback or determine based on user role
      const redirectTo = fallbackRoute || getRoleBasedPath(userRole);
      console.log(`Access denied. User role: ${normalizedUserRole}, Required: ${normalizedAllowedRoles.join(', ')}, Redirecting to: ${redirectTo}`);
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default RoleProtectedRoute;
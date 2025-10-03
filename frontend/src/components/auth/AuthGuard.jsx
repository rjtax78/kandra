import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { isAuthenticated, getCurrentUser, getUserRole, clearAuthData } from '../../utils/roleUtils';
import API from '../../services/api';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/sign-in',
    '/sign-up',
    '/comprehensive-role-selection',
    '/forgot-password',
    '/reset-password',
    '/test-backend',
    '/test-redirect'
  ];

  // Routes that require specific roles
  const roleProtectedRoutes = {
    '/dokarti': ['student'],
    '/etudiant': ['student'],
    '/company': ['company'],
    '/admin': ['admin']
  };

  const isPublicRoute = (path) => {
    return publicRoutes.some(route => {
      if (route === path) return true;
      // Handle dynamic routes
      if (route.includes(':')) {
        const routePattern = route.replace(/:[^\s/]+/g, '[\\w-]+');
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(path);
      }
      return false;
    });
  };

  const getRequiredRole = (path) => {
    for (const [routePattern, roles] of Object.entries(roleProtectedRoutes)) {
      if (path.startsWith(routePattern)) {
        return roles;
      }
    }
    return null;
  };

  const getRoleBasedDefaultRoute = (userRole) => {
    const normalizedRole = userRole?.toLowerCase();
    
    switch (normalizedRole) {
      case 'etudiant':
      case 'student':
        return '/dokarti';
      case 'entreprise':
      case 'company':
        return '/company/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dokarti'; // Default fallback
    }
  };

  const verifyAuthWithBackend = async (token) => {
    try {
      // Verify token with backend by making an authenticated request
      const response = await API.get('/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data?.user || null;
    } catch (error) {
      console.error('Token verification failed:', error);
      
      // If token is invalid, clear auth data
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthData();
      }
      
      return null;
    }
  };

  useEffect(() => {
    const handleAuthAndRedirect = async () => {
      setIsLoading(true);
      setIsAuthenticating(true);

      const currentPath = location.pathname;

      // Allow access to public routes without authentication
      if (isPublicRoute(currentPath)) {
        setIsLoading(false);
        setIsAuthenticating(false);
        return;
      }

      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        setIsLoading(false);
        setIsAuthenticating(false);
        navigate('/login', { 
          state: { from: currentPath },
          replace: true 
        });
        return;
      }

      // Get user data and role
      const user = getCurrentUser();
      const userRole = getUserRole();
      const token = localStorage.getItem('token');

      if (!user || !userRole || !token) {
        console.log('Incomplete auth data, redirecting to login');
        clearAuthData();
        setIsLoading(false);
        setIsAuthenticating(false);
        navigate('/login', { 
          state: { from: currentPath },
          replace: true 
        });
        return;
      }

      // Optionally verify token with backend (uncomment if you have a verify endpoint)
      /*
      const verifiedUser = await verifyAuthWithBackend(token);
      if (!verifiedUser) {
        console.log('Token verification failed, redirecting to login');
        setIsLoading(false);
        setIsAuthenticating(false);
        navigate('/login', { 
          state: { from: currentPath },
          replace: true 
        });
        return;
      }
      */

      // Check role-based access
      const requiredRoles = getRequiredRole(currentPath);
      
      if (requiredRoles) {
        const normalizedUserRole = userRole.toLowerCase();
        const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());
        
        // Check if user's role matches any required role
        const hasAccess = normalizedRequiredRoles.includes(normalizedUserRole) ||
                         normalizedRequiredRoles.includes('admin'); // Admin can access everything
        
        if (!hasAccess) {
          console.log(`Access denied. User role: ${normalizedUserRole}, Required roles: ${normalizedRequiredRoles.join(', ')}`);
          
          // Redirect to user's appropriate dashboard
          const defaultRoute = getRoleBasedDefaultRoute(userRole);
          console.log(`Redirecting to default route for role: ${defaultRoute}`);
          
          setIsLoading(false);
          setIsAuthenticating(false);
          navigate(defaultRoute, { replace: true });
          return;
        }
      }

      // If we reach here, user has proper access
      console.log(`Access granted for user role: ${userRole} to path: ${currentPath}`);
      setIsLoading(false);
      setIsAuthenticating(false);
    };

    handleAuthAndRedirect();
  }, [location.pathname]); // Remove navigate from dependencies to prevent infinite loops

  // Show loading spinner during authentication
  if (isLoading || isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              {isAuthenticating ? 'Authenticating...' : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Verifying your access permissions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
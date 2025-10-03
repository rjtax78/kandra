import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthWrapper = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, isLoading, isLoggedIn, getRoleBasedPath } = useAuth();

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

  const isPublicRoute = (path) => {
    return publicRoutes.includes(path) || path.startsWith('/test-');
  };

  useEffect(() => {
    // Don't redirect if still loading
    if (isLoading) return;

    const currentPath = location.pathname;

    // Handle authenticated users on public routes
    if (isLoggedIn && user && userRole) {
      // Redirect authenticated users away from auth pages
      if (['/login', '/register', '/sign-in', '/sign-up'].includes(currentPath)) {
        const dashboardPath = getRoleBasedPath();
        console.log(`Authenticated user on auth page, redirecting to: ${dashboardPath}`);
        navigate(dashboardPath, { replace: true });
        return;
      }

      // Redirect authenticated users from home page to their dashboard
      if (currentPath === '/') {
        const dashboardPath = getRoleBasedPath();
        console.log(`Authenticated user on home page, redirecting to: ${dashboardPath}`);
        navigate(dashboardPath, { replace: true });
        return;
      }
    }

    // Handle unauthenticated users on protected routes
    if (!isLoggedIn && !isPublicRoute(currentPath)) {
      console.log(`Unauthenticated user accessing protected route, redirecting to login`);
      navigate('/login', { 
        state: { from: currentPath },
        replace: true 
      });
      return;
    }

  }, [isLoading, isLoggedIn, user, userRole, location.pathname]); // Removed navigate and getRoleBasedPath to prevent loops

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">Loading...</p>
            <p className="text-xs text-gray-500 mt-1">Initializing authentication</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
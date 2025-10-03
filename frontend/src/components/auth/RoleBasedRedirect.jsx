import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole, getCurrentUser } from '../../utils/roleUtils';

const RoleBasedRedirect = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = () => {
      // Only redirect if user is authenticated
      if (!isAuthenticated()) {
        return;
      }

      const user = getCurrentUser();
      const userRole = getUserRole();
      
      // If user doesn't have a role, they shouldn't be authenticated
      if (!userRole || !user) {
        return;
      }
      
      const currentPath = location.pathname;
      
      // Define role-based default routes
      const getRoleBasedRoute = (role) => {
        const normalizedRole = role.toLowerCase();
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
            return '/dokarti';
        }
      };
      
      const defaultRoute = getRoleBasedRoute(userRole);
      
      // If user is on home page after authentication, redirect to their dashboard
      if (currentPath === '/') {
        console.log(`Authenticated user on home page, redirecting to: ${defaultRoute}`);
        navigate(defaultRoute, { replace: true });
        return;
      }
      
      // If user is on auth pages but already authenticated, redirect to dashboard
      const authPages = ['/login', '/register', '/sign-in', '/sign-up'];
      if (authPages.includes(currentPath)) {
        console.log(`Already authenticated user on auth page, redirecting to: ${defaultRoute}`);
        navigate(defaultRoute, { replace: true });
        return;
      }
    };

    handleRedirect();
  }, [location.pathname]); // Remove navigate from dependencies to prevent infinite loops

  return children;
};

export default RoleBasedRedirect;
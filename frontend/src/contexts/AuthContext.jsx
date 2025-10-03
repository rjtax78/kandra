import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { isAuthenticated, getCurrentUser, getUserRole, clearAuthData } from '../utils/roleUtils';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          const role = getUserRole();
          
          if (currentUser && role) {
            setUser(currentUser);
            setUserRole(role);
            setIsLoggedIn(true);
            
            // Set up API interceptor with token
            const token = localStorage.getItem('token');
            if (token) {
              API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
          } else {
            // Clear invalid auth state
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const response = await API.post('/auth/login', credentials);
      const { token, user: userData } = response.data;

      if (token && userData) {
        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update API headers
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(userData);
        setUserRole(getUserRole());
        setIsLoggedIn(true);
        
        return { success: true, user: userData, token };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await API.post('/auth/register', userData);
      const { token, user: newUser } = response.data;

      if (token && newUser) {
        // Store authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Update API headers
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(newUser);
        setUserRole(getUserRole());
        setIsLoggedIn(true);
        
        return { success: true, user: newUser, token };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      // Clear authentication data
      clearAuthData();
      
      // Clear API headers
      delete API.defaults.headers.common['Authorization'];
      
      // Update state
      setUser(null);
      setUserRole(null);
      setIsLoggedIn(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }, []);

  // Get role-based redirect path
  const getRoleBasedPath = useCallback((role = userRole) => {
    const normalizedRole = role?.toLowerCase();
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
  }, [userRole]);

  // Check if user has permission for a route
  const hasPermission = useCallback((requiredRoles) => {
    if (!userRole) return false;
    
    const normalizedUserRole = userRole.toLowerCase();
    const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());
    
    // Admin has access to everything
    if (normalizedUserRole === 'admin') return true;
    
    return normalizedRequiredRoles.includes(normalizedUserRole);
  }, [userRole]);

  // Refresh user data from stored data
  const refreshUser = useCallback(() => {
    try {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        const role = getUserRole();
        
        if (currentUser && role) {
          setUser(currentUser);
          setUserRole(role);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  const value = useMemo(() => ({
    // State
    user,
    userRole,
    isLoading,
    isLoggedIn,
    
    // Functions
    login,
    register,
    logout,
    getRoleBasedPath,
    hasPermission,
    refreshUser
  }), [user, userRole, isLoading, isLoggedIn, login, register, logout, getRoleBasedPath, hasPermission, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, Grid3X3, User, LogOut, Settings, Briefcase, Users, Building2, Home, FileText } from 'lucide-react';
import { getUserRole, USER_ROLES, getCurrentUser, clearAuthData, isAuthenticated, getUserDisplayName } from '../../utils/roleUtils';
import { useAuth } from '../../contexts/AuthContext';

const JwtNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef();
  const { user, userRole, logout } = useAuth();

  // Role-based navigation items
  const getNavItems = () => {
    switch (userRole) {
      case USER_ROLES.STUDENT:
        return [
          { name: 'Browse Jobs', href: '/student/dashboard', icon: Briefcase, active: location.pathname === '/dokarti' },
          { name: 'My Applications', href: '/student/applications', icon: FileText, active: location.pathname === '/student/applications' },
          { name: 'Profile', href: '/student/profile', icon: User, active: location.pathname === '/student/profile' },
        ];
      case USER_ROLES.COMPANY:
        return [
          { name: 'Dashboard', href: '/company/dashboard', icon: Home, active: location.pathname === '/company/dashboard' },
          { name: 'Post Job', href: '/company/post-job', icon: Briefcase, active: location.pathname === '/company/post-job' },
          { name: 'Applications', href: '/company/applications', icon: Users, active: location.pathname === '/company/applications' },
        ];
      case USER_ROLES.ADMIN:
        return [
          { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Home, active: location.pathname === '/admin/dashboard' },
          { name: 'Users', href: '/admin/users', icon: Users, active: location.pathname === '/admin/users' },
          { name: 'Companies', href: '/admin/companies', icon: Building2, active: location.pathname === '/admin/companies' },
        ];
      default:
        return [
          { name: 'Find Work', href: '/etudiant/offres', icon: Briefcase, active: location.pathname === '/etudiant/offres' },
          { name: 'My Jobs', href: '/etudiant/jobs', icon: User, active: false },
        ];
    }
  };

  const navItems = getNavItems();

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (!confirmSignOut) return;
    
    try {
      const result = logout();
      
      setShowUserMenu(false);
      
      if (result.success) {
        // Show success message
        alert('You have been signed out successfully.');
        
        // Navigate to login page
        navigate('/login');
      } else {
        alert('Error occurred during sign out. Please try again.');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error occurred during sign out. Please try again.');
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userDisplayName = getUserDisplayName();
  const userInitials = userDisplayName.split(' ').map(name => name[0]).join('').toUpperCase() || 'U';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">Kandra</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Grid Menu */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Grid3X3 className="w-5 h-5" />
            </button>

            {/* User Avatar */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">{userInitials}</span>
                </div>
                {user?.prenom && (
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.prenom}
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userDisplayName}</p>
                    <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      userRole === USER_ROLES.ADMIN ? 'bg-red-100 text-red-800' :
                      userRole === USER_ROLES.COMPANY ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {userRole === USER_ROLES.ADMIN ? '👩‍💼 Admin' :
                       userRole === USER_ROLES.COMPANY ? '🏢 Company' :
                       '👨‍🎓 Student'}
                    </span>
                  </div>
                  
                  <Link 
                    to={userRole === USER_ROLES.STUDENT ? '/student/profile' : '/profile'} 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  
                  {/* Testing info */}
                  {userRole === USER_ROLES.ADMIN && (
                    <>
                      <hr className="my-1" />
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500 mb-1">JWT Auth Active 🔐</p>
                        <p className="text-xs text-green-600">Backend Integration ✅</p>
                      </div>
                    </>
                  )}
                  
                  <hr className="my-1" />
                  
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default JwtNavbar;
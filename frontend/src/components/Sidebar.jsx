import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Building2, 
  FileText, 
  User, 
  BookOpen, 
  BarChart3 
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    {
      to: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      description: 'Vue d\'ensemble'
    },
    {
      to: '/opportunities',
      icon: Search,
      label: 'Opportunités',
      description: 'Rechercher des offres'
    },
    {
      to: '/entreprises',
      icon: Building2,
      label: 'Entreprises',
      description: 'Découvrir les entreprises'
    },
    {
      to: '/student/applications',
      icon: FileText,
      label: 'Mes Candidatures',
      description: 'Suivre vos candidatures'
    },
    {
      to: '/student/profile',
      icon: User,
      label: 'Mon Profil',
      description: 'Gérer votre profil'
    },
    {
      to: '/ressources',
      icon: BookOpen,
      label: 'Ressources',
      description: 'Guides et conseils'
    },
    {
      to: '/statistiques',
      icon: BarChart3,
      label: 'Statistiques',
      description: 'Vos performances'
    }
  ];
  
  const isActiveLink = (path) => {
    return location.pathname === path;
  };
  
  return (
    <aside className="w-64 p-4 bg-white rounded-lg shadow-lg h-full border border-gray-100">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Menu</h2>
        <p className="text-sm text-gray-500">Navigation principale</p>
      </div>
      
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.to);
            
            return (
              <li key={item.to}>
                <Link 
                  to={item.to} 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs truncate ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-blue-900">
                Profil complet?
              </p>
              <p className="text-xs text-blue-700">
                Optimisez vos chances
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            className="mt-3 block w-full bg-blue-600 text-white text-center text-xs font-medium py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Compléter le profil
          </Link>
        </div>
      </div>
    </aside>
  );
}

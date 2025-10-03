import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Building2, Shield, Briefcase, Users, Settings } from 'lucide-react';

const RoleSelection = () => {
  const { user } = useUser();
  const { user: clerkUser } = useClerk();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'student',
      title: '👨‍🎓 Student',
      description: 'I am looking for job opportunities',
      features: [
        'Browse job listings',
        'Apply to positions',
        'Track applications',
        'Build profile',
        'Get job recommendations'
      ],
      icon: User,
      color: 'blue',
      redirect: '/dokarti'
    },
    {
      id: 'company',
      title: '🏢 Company',
      description: 'I want to hire talented professionals',
      features: [
        'Post job listings',
        'Manage applications',
        'Company analytics',
        'Candidate search',
        'Team management'
      ],
      icon: Building2,
      color: 'purple',
      redirect: '/company/dashboard'
    },
    {
      id: 'admin',
      title: '👩‍💼 Admin',
      description: 'I manage the platform (restricted access)',
      features: [
        'User management',
        'Platform analytics',
        'Content moderation',
        'System configuration',
        'Full access control'
      ],
      icon: Shield,
      color: 'red',
      redirect: '/admin/dashboard'
    }
  ];

  const handleRoleSelect = (roleId) => {
    // Store the selected role temporarily and navigate to setup instructions
    localStorage.setItem('pendingRole', roleId);
    navigate('/setup-instructions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Kandra, {user?.firstName}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            To get started, please select your role. This will customize your experience and show you relevant features.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected 
                    ? `border-${role.color}-500 ring-4 ring-${role.color}-100 transform scale-105`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${
                    role.color === 'blue' ? 'from-blue-400 to-blue-600' :
                    role.color === 'purple' ? 'from-purple-400 to-purple-600' :
                    'from-red-400 to-red-600'
                  } rounded-full flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {role.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-2">
                    {role.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          role.color === 'blue' ? 'bg-blue-400' :
                          role.color === 'purple' ? 'bg-purple-400' :
                          'bg-red-400'
                        }`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {isSelected && (
                    <Button
                      onClick={() => handleRoleSelect(role.id)}
                      disabled={isLoading}
                      className={`w-full mt-4 ${
                        role.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                        role.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                        'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Setting up...
                        </div>
                      ) : (
                        `Continue as ${role.title}`
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>You can change your role later in your profile settings.</p>
          <p className="mt-2">
            <strong>Note:</strong> Admin access requires approval and is restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
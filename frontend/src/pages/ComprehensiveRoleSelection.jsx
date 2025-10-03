import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Building2, Shield, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import API from '../services/api';

const ComprehensiveRoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    // Get registration data from sessionStorage
    const data = sessionStorage.getItem('registrationData');
    if (!data) {
      // If no registration data, redirect back to signup
      navigate('/register');
      return;
    }
    setRegistrationData(JSON.parse(data));
  }, [navigate]);

  const roles = [
    {
      id: 'student',
      title: 'Student / Job Seeker',
      subtitle: 'Looking for job opportunities',
      icon: User,
      description: 'Perfect for students, graduates, and professionals seeking new career opportunities.',
      features: [
        'Browse thousands of job listings',
        'Apply to positions with one click',
        'Track your applications',
        'Build a professional profile',
        'Get personalized job recommendations',
        'Access career resources and tips'
      ],
      benefits: 'Get access to the best job opportunities from verified companies.',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      redirect: '/dokarti'
    },
    {
      id: 'company',
      title: 'Company / Employer',
      subtitle: 'Hiring talented professionals',
      icon: Building2,
      description: 'Ideal for companies, startups, and recruiters looking to find the best talent.',
      features: [
        'Post unlimited job listings',
        'Access to talent database',
        'Advanced candidate filtering',
        'Application management system',
        'Company branding and profiles',
        'Analytics and hiring insights'
      ],
      benefits: 'Find the perfect candidates faster with our advanced matching system.',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-100',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-600',
      redirect: '/company/dashboard'
    },
    {
      id: 'admin',
      title: 'Administrator',
      subtitle: 'Platform management access',
      icon: Shield,
      description: 'Restricted access for platform administrators and moderators only.',
      features: [
        'Full platform administration',
        'User and company management',
        'Content moderation tools',
        'Analytics and reporting',
        'System configuration',
        'Security and compliance'
      ],
      benefits: 'Complete control and oversight of the entire platform.',
      color: 'red',
      gradient: 'from-red-500 to-orange-600',
      bgGradient: 'from-red-50 to-orange-100',
      borderColor: 'border-red-500',
      textColor: 'text-red-600',
      redirect: '/admin/dashboard',
      restricted: true
    }
  ];

  const handleRoleSelect = async () => {
    if (!selectedRole || !registrationData) return;

    setIsLoading(true);

    try {
      // Prepare data for backend registration
      const registrationPayload = {
        email: registrationData.email,
        password: registrationData.password,
        nom: registrationData.lastName,  // Backend expects 'nom' (last name)
        prenom: registrationData.firstName,  // Backend expects 'prenom' (first name)
        role: selectedRole === 'student' ? 'etudiant' : selectedRole === 'company' ? 'entreprise' : selectedRole,
        // Add optional fields based on role
        ...(selectedRole === 'student' && { matricule: registrationData.username }), // Use username as matricule for students
        ...(selectedRole === 'company' && { raisonSociale: `${registrationData.firstName} ${registrationData.lastName} Company` }) // Generate company name
      };

      console.log('Registering user with payload:', registrationPayload);

      // Register user in your MySQL database
      const response = await API.post('/auth/register', registrationPayload);
      
      if (response.data) {
        console.log('Registration successful:', response.data);
        
        // Clear registration data from sessionStorage
        sessionStorage.removeItem('registrationData');
        
        // Store the token if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }

        // Show success message
        alert('Account created successfully! Welcome to Kandra!');
        
        // Navigate to appropriate dashboard based on role
        const selectedRoleData = roles.find(role => role.id === selectedRole);
        navigate(selectedRoleData.redirect);
        
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Please check your information and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Kandra, {registrationData.firstName}! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You're almost there! Please select your role to customize your experience and access the features most relevant to you.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 group ${
                  isSelected 
                    ? `${role.borderColor} ring-4 ring-opacity-20 ring-${role.color}-500 transform scale-105 shadow-xl`
                    : 'border-gray-200 hover:border-gray-300 hover:transform hover:scale-102'
                } ${role.restricted ? 'opacity-75' : ''}`}
                onClick={() => !role.restricted && setSelectedRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${role.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {role.title}
                  </CardTitle>
                  
                  <p className={`text-sm font-medium ${role.textColor} mb-4`}>
                    {role.subtitle}
                  </p>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {role.description}
                  </p>
                  
                  {role.restricted && (
                    <div className="mt-3 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      Restricted Access
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Features List */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
                      <ul className="space-y-2">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className={`w-4 h-4 ${role.textColor} mr-3 mt-0.5 flex-shrink-0`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Benefits */}
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${role.bgGradient}`}>
                      <p className="text-sm font-medium text-gray-800">
                        💡 {role.benefits}
                      </p>
                    </div>
                    
                    {/* Selection Button */}
                    {isSelected && !role.restricted && (
                      <div className="pt-2">
                        <div className={`w-full p-3 bg-gradient-to-r ${role.gradient} text-white rounded-lg flex items-center justify-center font-medium`}>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Selected
                        </div>
                      </div>
                    )}
                    
                    {role.restricted && (
                      <div className="pt-2">
                        <div className="w-full p-3 bg-gray-200 text-gray-500 rounded-lg text-center text-sm">
                          Contact admin for access
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Section */}
        {selectedRole && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Click below to create your account and access your personalized dashboard.
                  </p>
                  
                  <Button
                    onClick={handleRoleSelect}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transform transition-all duration-200 hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating your account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account & Continue
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>You can always change your role later in your account settings.</p>
          <p className="mt-2">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-500">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveRoleSelection;
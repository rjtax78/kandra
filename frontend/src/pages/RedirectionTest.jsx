import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { User, Building2, Shield, ArrowRight, LogOut } from 'lucide-react';

const RedirectionTest = () => {
  const navigate = useNavigate();
  const { user, userRole, logout, getRoleBasedPath, login } = useAuth();
  const [testingRole, setTestingRole] = useState(null);

  const testUsers = [
    {
      id: 'student',
      name: 'Test Student',
      email: 'student1759477462282@test.com',
      password: 'TestPassword123',
      expectedRole: 'etudiant',
      expectedRedirect: '/dokarti',
      icon: User,
      color: 'blue',
      description: 'Should redirect to job search page'
    },
    {
      id: 'company',
      name: 'Test Company',
      email: 'company1759477498591@test.com',
      password: 'TestPassword123',
      expectedRole: 'entreprise',
      expectedRedirect: '/company/dashboard',
      icon: Building2,
      color: 'purple',
      description: 'Should redirect to company dashboard'
    }
  ];

  const testUserLogin = async (testUser) => {
    setTestingRole(testUser.id);
    
    try {
      console.log(`Testing login for ${testUser.name}...`);
      
      const result = await login({
        email: testUser.email,
        password: testUser.password
      });

      if (result.success) {
        console.log(`Login successful for ${testUser.name}:`, result.user);
        
        const actualRole = result.user.role;
        const actualRedirect = getRoleBasedPath(actualRole);
        
        // Log test results
        console.log('=== REDIRECTION TEST RESULTS ===');
        console.log(`User: ${testUser.name}`);
        console.log(`Expected Role: ${testUser.expectedRole}`);
        console.log(`Actual Role: ${actualRole}`);
        console.log(`Expected Redirect: ${testUser.expectedRedirect}`);
        console.log(`Actual Redirect: ${actualRedirect}`);
        console.log(`Match: ${actualRedirect === testUser.expectedRedirect ? '✅' : '❌'}`);
        
        // Show results to user
        alert(
          `🔄 Redirection Test Results:\n\n` +
          `User: ${testUser.name}\n` +
          `Database Role: ${actualRole}\n` +
          `Redirect Target: ${actualRedirect}\n` +
          `Expected: ${testUser.expectedRedirect}\n\n` +
          `${actualRedirect === testUser.expectedRedirect ? '✅ PASS' : '❌ FAIL'}\n\n` +
          `Redirecting in 2 seconds...`
        );
        
        // Delay redirect to show results
        setTimeout(() => {
          navigate(actualRedirect);
        }, 2000);
        
      } else {
        console.error(`Login failed for ${testUser.name}:`, result.error);
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.error(`Test error for ${testUser.name}:`, error);
      alert(`Test error: ${error.message}`);
    } finally {
      setTestingRole(null);
    }
  };

  const handleLogout = async () => {
    try {
      const result = logout();
      if (result.success) {
        alert('Logged out successfully! You can now test different users.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Role-Based Redirection Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test the redirection functionality based on user roles stored in the database.
            Each user type should be redirected to their appropriate dashboard.
          </p>
        </div>

        {/* Current User Status */}
        {user && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Currently Logged In As:</p>
                  <p className="text-lg font-bold text-green-900">
                    {user.prenom} {user.nom} ({user.email})
                  </p>
                  <p className="text-sm text-green-700">
                    Role: <span className="font-semibold">{user.role}</span> → Should redirect to: <span className="font-semibold">{getRoleBasedPath(user.role)}</span>
                  </p>
                </div>
                <Button onClick={handleLogout} variant="outline" className="border-green-300">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Users Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {testUsers.map((testUser) => {
            const Icon = testUser.icon;
            const isLoading = testingRole === testUser.id;
            
            return (
              <Card key={testUser.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${testUser.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${testUser.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{testUser.name}</CardTitle>
                      <p className="text-sm text-gray-600">{testUser.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Test Details:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Email:</strong> {testUser.email}</p>
                        <p><strong>Expected Role:</strong> {testUser.expectedRole}</p>
                        <p><strong>Expected Redirect:</strong> {testUser.expectedRedirect}</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => testUserLogin(testUser)}
                      disabled={isLoading || !!testingRole}
                      className={`w-full bg-${testUser.color}-600 hover:bg-${testUser.color}-700`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Testing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          Test {testUser.name}
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-900 mb-3">How to Test:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
              <li>Click "Test Student" - should login and redirect to <code className="bg-blue-200 px-1 rounded">/dokarti</code></li>
              <li>Click "Test Company" - should login and redirect to <code className="bg-blue-200 px-1 rounded">/company/dashboard</code></li>
              <li>Each test will show you the actual vs expected results</li>
              <li>Use the logout button to test different users</li>
            </ol>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> This test uses real user accounts from the database to verify 
                that role-based redirections work correctly with actual backend data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RedirectionTest;
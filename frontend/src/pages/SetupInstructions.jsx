import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Copy, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';

const SetupInstructions = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('pendingRole') || 'student';
  });
  const [copied, setCopied] = useState(false);

  const roleMetadata = {
    student: { "role": "student" },
    company: { "role": "company" },
    admin: { "role": "admin" }
  };

  const copyToClipboard = () => {
    const text = JSON.stringify(roleMetadata[selectedRole], null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleSelection = (role) => {
    localStorage.setItem('tempUserRole', role);
    setSelectedRole(role);
  };

  const proceedWithRole = () => {
    const routes = {
      student: '/dokarti',
      company: '/company/dashboard',
      admin: '/admin/dashboard'
    };
    navigate(routes[selectedRole]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            🔧 Quick Setup Required
          </CardTitle>
          <p className="text-gray-600">
            To enable role-based features, we need to set your user role. Choose your role below and follow the instructions.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">1. Select Your Role:</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'student', title: '👨‍🎓 Student', desc: 'Looking for jobs' },
                { id: 'company', title: '🏢 Company', desc: 'Hiring talent' },
                { id: 'admin', title: '👩‍💼 Admin', desc: 'Platform management' }
              ].map((role) => (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all ${
                    selectedRole === role.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleRoleSelection(role.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{role.title}</div>
                    <p className="text-sm text-gray-600">{role.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">2. Set Role in Clerk Dashboard:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Go to Clerk Dashboard</p>
                  <a 
                    href="https://dashboard.clerk.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    Open Clerk Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Navigate to Users → Find your account → Public Metadata</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Add this JSON to Public Metadata:</p>
                  <div className="mt-2 bg-gray-800 text-green-400 p-3 rounded font-mono text-sm relative">
                    <pre>{JSON.stringify(roleMetadata[selectedRole], null, 2)}</pre>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-medium">Save changes and refresh this page</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={proceedWithRole}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue with {selectedRole} role (temporary)
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>

          {/* Note */}
          <div className="text-center text-sm text-gray-500">
            <p>
              <strong>Note:</strong> The "Continue" button uses temporary storage. 
              For permanent role assignment, please follow the Clerk Dashboard instructions above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupInstructions;
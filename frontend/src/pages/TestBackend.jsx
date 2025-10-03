import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import API from '../services/api';

const TestBackend = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await API.get('/test');
      setResponse(result.data);
    } catch (err) {
      console.error('Backend test error:', err);
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const testData = {
        email: `test.${Date.now()}@example.com`,
        password: 'TestPassword123',
        nom: 'Doe',
        prenom: 'John',
        role: 'etudiant',
        matricule: `TEST${Date.now()}`
      };

      const result = await API.post('/auth/register', testData);
      setResponse(result.data);
    } catch (err) {
      console.error('Registration test error:', err);
      setError(err.response?.data?.message || err.message || 'Registration test failed');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const loginData = {
        email: 'student1759477462282@test.com', // Demo student account
        password: 'TestPassword123'
      };

      const result = await API.post('/auth/login', loginData);
      setResponse({
        ...result.data,
        message: 'Login successful!',
        userRole: result.data.user?.role
      });
    } catch (err) {
      console.error('Login test error:', err);
      setError(err.response?.data?.error || err.message || 'Login test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Backend API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Test your backend API connection and registration endpoint
            </p>
            <p className="text-sm text-gray-500">
              Backend URL: {API.defaults.baseURL}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button 
              onClick={testConnection} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Button 
              onClick={testRegistration} 
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Registration'}
            </Button>
            
            <Button 
              onClick={testLogin} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {response && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Response:</h3>
              <pre className="text-sm text-green-700 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <div className="pt-4 border-t text-center">
            <p className="text-sm text-gray-500">
              Make sure your backend server is running on port 5000
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestBackend;
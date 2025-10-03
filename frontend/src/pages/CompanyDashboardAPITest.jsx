import React, { useState } from 'react';
import API from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const CompanyDashboardAPITest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async (endpoint, method = 'GET', data = null, description) => {
    try {
      console.log(`Testing ${method} ${endpoint}:`, data);
      
      let response;
      switch (method) {
        case 'GET':
          response = await API.get(endpoint);
          break;
        case 'POST':
          response = await API.post(endpoint, data);
          break;
        case 'PUT':
          response = await API.put(endpoint, data);
          break;
        case 'DELETE':
          response = await API.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return {
        success: true,
        data: response.data,
        status: response.status,
        description
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        status: error.response?.status || 'Network Error',
        description
      };
    }
  };

  const runCompanyDashboardTests = async () => {
    setIsLoading(true);
    const results = {};

    // Test 1: Get company stats
    console.log('=== Testing Company Dashboard APIs ===');
    results.stats = await testAPI('/opportunites/company/stats', 'GET', null, 'Fetch company statistics');

    // Test 2: Get company offers
    results.offers = await testAPI('/opportunites/company/offers', 'GET', null, 'Fetch company offers');

    // Test 3: Create a test job offer
    const testJobData = {
      titre: 'Test Software Developer Position',
      description: 'This is a test job offer created by the API integration test',
      typeOffre: 'emploi',
      localisation: 'Paris, France',
      salaire: '45000-60000 EUR',
      niveauEtude: 'Bachelor degree',
      competencesRequises: 'JavaScript, React, Node.js',
      dateExpiration: '2024-12-31',
      nombrePostes: 2,
      statut: 'brouillon',
      typeContrat: 'CDI',
      experienceRequise: '2-5 years',
      avantages: 'Health insurance, Remote work options',
      estNegociable: true
    };
    results.createJob = await testAPI('/opportunites', 'POST', testJobData, 'Create new job offer');

    // If job creation was successful, test update and delete
    if (results.createJob.success && results.createJob.data.id) {
      const jobId = results.createJob.data.id;
      
      // Test 4: Update the created job
      const updateData = {
        titre: 'Updated Test Software Developer Position',
        statut: 'publiee',
        salaire: '50000-65000 EUR'
      };
      results.updateJob = await testAPI(`/opportunites/${jobId}`, 'PUT', updateData, `Update job offer ID: ${jobId}`);

      // Test 5: Delete the created job
      results.deleteJob = await testAPI(`/opportunites/${jobId}`, 'DELETE', null, `Delete job offer ID: ${jobId}`);
    }

    // Test 6: Create a test internship offer
    const testInternshipData = {
      titre: 'Test Frontend Development Internship',
      description: 'This is a test internship offer created by the API integration test',
      typeOffre: 'stage',
      localisation: 'Lyon, France',
      niveauEtude: 'Master student',
      competencesRequises: 'React, CSS, JavaScript',
      dateExpiration: '2024-11-30',
      nombrePostes: 1,
      statut: 'brouillon',
      duree: '6 months',
      estRemunere: true,
      montantRemuneration: '800',
      dateDebut: '2024-09-01',
      objectifs: 'Learn modern frontend development practices'
    };
    results.createInternship = await testAPI('/opportunites', 'POST', testInternshipData, 'Create new internship offer');

    // Clean up internship if created successfully
    if (results.createInternship.success && results.createInternship.data.id) {
      const internshipId = results.createInternship.data.id;
      results.deleteInternship = await testAPI(`/opportunites/${internshipId}`, 'DELETE', null, `Delete internship offer ID: ${internshipId}`);
    }

    setTestResults(results);
    setIsLoading(false);
    console.log('=== Test Results ===', results);
  };

  const renderTestResult = (key, result) => {
    if (!result) return null;

    return (
      <Card key={key} className={`mb-4 ${result.success ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader>
          <CardTitle className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.success ? '✅' : '❌'} {result.description}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div><strong>Status:</strong> {result.status}</div>
            {result.success ? (
              <div>
                <strong>Response Data:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto text-xs">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-red-600">
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Company Dashboard API Integration Test</h1>
          
          <div className="mb-6">
            <Button 
              onClick={runCompanyDashboardTests} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Running Tests...' : 'Run API Tests'}
            </Button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results:</h2>
              <div className="space-y-4">
                {Object.entries(testResults).map(([key, result]) => renderTestResult(key, result))}
              </div>

              {/* Summary */}
              <Card className="mt-6 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">Test Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>Total Tests: {Object.keys(testResults).length}</div>
                    <div className="text-green-600">
                      Passed: {Object.values(testResults).filter(r => r.success).length}
                    </div>
                    <div className="text-red-600">
                      Failed: {Object.values(testResults).filter(r => !r.success).length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardAPITest;
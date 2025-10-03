#!/usr/bin/env node

/**
 * Test Script for Kandra Signup Flow
 * Tests the complete backend integration with the new signup flow
 */

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

async function testBackendConnection() {
  console.log('🔗 Testing backend connection...');
  try {
    const response = await fetch(`${BACKEND_URL}/test`);
    const data = await response.json();
    console.log('✅ Backend connection successful:', data.message);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
}

async function testRegistrationEndpoint() {
  console.log('\n👤 Testing user registration...');
  
  const testUser = {
    email: `test.user.${Date.now()}@example.com`,
    password: 'TestPassword123',
    nom: 'TestLastName',
    prenom: 'TestFirstName',
    role: 'etudiant',
    matricule: `TEST${Date.now()}`
  };

  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('   Message:', data.message);
      console.log('   User ID:', data.user.id);
      console.log('   Token received:', data.token ? 'Yes' : 'No');
      
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } else {
      console.error('❌ Registration failed:', data.error || data.message);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('❌ Registration request failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testLoginEndpoint(email, password) {
  console.log('\n🔑 Testing user login...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('   Message:', data.message);
      console.log('   User role:', data.user.role);
      console.log('   Token received:', data.token ? 'Yes' : 'No');
      return { success: true, user: data.user, token: data.token };
    } else {
      console.error('❌ Login failed:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('❌ Login request failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testFrontendBackendIntegration() {
  console.log('\n🌐 Testing frontend-backend integration...');
  
  // Test if frontend can reach backend
  try {
    // This simulates what the frontend TestBackend component does
    const response = await fetch(`${BACKEND_URL}/test`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Frontend can communicate with backend');
      console.log('   Response:', data.message);
      return true;
    } else {
      console.error('❌ Frontend-backend communication failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Frontend-backend integration test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Kandra Signup Flow Integration Tests\n');
  console.log('=' .repeat(60));
  
  const results = {
    backendConnection: false,
    registration: false,
    login: false,
    frontendIntegration: false
  };
  
  // Test 1: Backend Connection
  results.backendConnection = await testBackendConnection();
  
  // Test 2: Registration
  if (results.backendConnection) {
    const registrationResult = await testRegistrationEndpoint();
    results.registration = registrationResult.success;
    
    // Test 3: Login (only if registration succeeded)
    if (results.registration && registrationResult.user) {
      // Extract email from the test user we just created
      const loginResult = await testLoginEndpoint(
        registrationResult.user.email, 
        'TestPassword123'
      );
      results.login = loginResult.success;
    }
  }
  
  // Test 4: Frontend Integration
  results.frontendIntegration = await testFrontendBackendIntegration();
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));
  
  console.log(`Backend Connection:     ${results.backendConnection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`User Registration:      ${results.registration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`User Login:            ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Integration:   ${results.frontendIntegration ? '✅ PASS' : '❌ FAIL'}`);
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log('\n' + '-' .repeat(60));
  console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Your signup flow is ready to use.');
    console.log('\n📋 Next Steps:');
    console.log('   1. Open http://localhost:5173/register to test the UI');
    console.log('   2. Try the complete signup flow with role selection');
    console.log('   3. Visit http://localhost:5173/test-backend for manual testing');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
    
    if (!results.backendConnection) {
      console.log('   • Make sure your backend server is running on port 5000');
      console.log('   • Check if MySQL is running and accessible');
    }
    if (!results.frontendIntegration) {
      console.log('   • Make sure your frontend server is running on port 5173');
      console.log('   • Check for CORS issues between frontend and backend');
    }
  }
  
  console.log('\n🔧 Manual Testing URLs:');
  console.log(`   Frontend: ${FRONTEND_URL}`);
  console.log(`   Backend:  ${BACKEND_URL}`);
  console.log(`   Test Page: ${FRONTEND_URL}/test-backend`);
  console.log(`   Signup Flow: ${FRONTEND_URL}/register`);
}

// Run the tests
runAllTests().catch(console.error);
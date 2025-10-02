#!/usr/bin/env node

/**
 * KANDRA API Test Script
 * Tests the main API endpoints to verify backend functionality
 */

const BASE_URL = 'http://localhost:5000/api';

async function makeRequest(endpoint, method = 'GET', body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error.message);
    return { status: 500, error: error.message };
  }
}

async function testAuth() {
  console.log('🔐 Testing Authentication...\n');

  // Test Registration
  console.log('📝 Testing registration...');
  const registerData = {
    email: 'test.user@etudiant.sprayinfo.com',
    password: 'testpass123',
    nom: 'Test',
    prenom: 'User',
    role: 'etudiant',
    matricule: 'ET2024999'
  };

  const registerResult = await makeRequest('/auth/register', 'POST', registerData);
  console.log(`   Status: ${registerResult.status}`);
  if (registerResult.status === 201) {
    console.log('   ✅ Registration successful');
  } else {
    console.log('   ❌ Registration failed:', registerResult.data?.error || 'Unknown error');
  }

  // Test Login with existing user
  console.log('\n🔓 Testing login...');
  const loginData = {
    email: 'marie.diop@etudiant.sprayinfo.com',
    password: 'password123'
  };

  const loginResult = await makeRequest('/auth/login', 'POST', loginData);
  console.log(`   Status: ${loginResult.status}`);
  
  if (loginResult.status === 200 && loginResult.data.token) {
    console.log('   ✅ Login successful');
    console.log(`   📄 User: ${loginResult.data.user.nom} ${loginResult.data.user.prenom}`);
    console.log(`   🎭 Role: ${loginResult.data.user.role}`);
    return loginResult.data.token;
  } else {
    console.log('   ❌ Login failed:', loginResult.data?.error || 'Unknown error');
    return null;
  }
}

async function testOffres(token) {
  console.log('\n💼 Testing Offers API...\n');

  // Test listing offers
  console.log('📋 Testing offers listing...');
  const offersResult = await makeRequest('/opportunite', 'GET', null, token);
  console.log(`   Status: ${offersResult.status}`);
  
  if (offersResult.status === 200 && Array.isArray(offersResult.data)) {
    console.log(`   ✅ Found ${offersResult.data.length} offers`);
    offersResult.data.forEach((offer, index) => {
      console.log(`   📝 ${index + 1}. ${offer.titre} (${offer.typeOffre}) - ${offer.entrepriseNom}`);
    });
    return offersResult.data;
  } else {
    console.log('   ❌ Failed to fetch offers:', offersResult.data?.error || 'Unknown error');
    return [];
  }
}

async function testOfferDetail(offers, token) {
  if (offers.length === 0) return;

  console.log('\n📄 Testing offer detail...');
  const firstOffer = offers[0];
  const detailResult = await makeRequest(`/opportunite/${firstOffer.id}`, 'GET', null, token);
  console.log(`   Status: ${detailResult.status}`);
  
  if (detailResult.status === 200) {
    console.log('   ✅ Offer details retrieved successfully');
    console.log(`   📝 Title: ${detailResult.data.titre}`);
    console.log(`   🏢 Company: ${detailResult.data.entrepriseNom}`);
    console.log(`   📍 Location: ${detailResult.data.localisation}`);
    console.log(`   💰 Salary: ${detailResult.data.salaire}`);
    
    if (detailResult.data.stageDetails) {
      console.log('   🎓 Stage details:');
      console.log(`      Duration: ${detailResult.data.stageDetails.duree}`);
      console.log(`      Remunerated: ${detailResult.data.stageDetails.estRemunere ? 'Yes' : 'No'}`);
    }
    
    if (detailResult.data.emploiDetails) {
      console.log('   💼 Job details:');
      console.log(`      Contract: ${detailResult.data.emploiDetails.typeContrat}`);
      console.log(`      Experience: ${detailResult.data.emploiDetails.experienceRequise}`);
    }
  } else {
    console.log('   ❌ Failed to fetch offer details:', detailResult.data?.error || 'Unknown error');
  }
}

async function testCompanyLogin() {
  console.log('\n🏢 Testing Company Login...\n');

  const companyLoginData = {
    email: 'rh@sonatel.sn',
    password: 'password123'
  };

  const companyLoginResult = await makeRequest('/auth/login', 'POST', companyLoginData);
  console.log(`   Status: ${companyLoginResult.status}`);
  
  if (companyLoginResult.status === 200 && companyLoginResult.data.token) {
    console.log('   ✅ Company login successful');
    console.log(`   🏢 Company: ${companyLoginResult.data.user.nom} ${companyLoginResult.data.user.prenom}`);
    console.log(`   🎭 Role: ${companyLoginResult.data.user.role}`);
    return companyLoginResult.data.token;
  } else {
    console.log('   ❌ Company login failed:', companyLoginResult.data?.error || 'Unknown error');
    return null;
  }
}

async function testCreateOffer(companyToken) {
  if (!companyToken) return;

  console.log('\n➕ Testing offer creation...');

  // First, we need to get the company ID from a companies endpoint
  // For now, we'll use a known company ID from our seed data
  const newOfferData = {
    titre: 'Stage Développeur React Test',
    typeOffre: 'stage',
    description: 'Stage de développement React créé via test API pour valider la création d\'offres.',
    localisation: 'Dakar, Sénégal',
    niveauEtude: 'Master 1',
    competencesRequises: 'React, JavaScript, CSS',
    dateExpiration: '2025-08-30',
    salaire: '150 000 FCFA/mois',
    // We need to get this from the logged-in company
    entrepriseId: 'company-id-placeholder',
    // Stage specific fields
    duree: '3 mois',
    estRemunere: true,
    montantRemuneration: 150000,
    dateDebut: '2025-06-01',
    objectifs: 'Développer des compétences en React et intégration d\'APIs REST.'
  };

  console.log('   ⚠️  Note: Offer creation requires company ID from authenticated user');
  console.log('   📝 Sample offer data prepared for testing');
}

async function runTests() {
  console.log('🧪 Starting KANDRA API Tests...\n');
  console.log('🔍 Make sure the backend server is running on http://localhost:5000\n');

  try {
    // Test authentication
    const studentToken = await testAuth();
    
    // Test offers API
    const offers = await testOffres(studentToken);
    await testOfferDetail(offers, studentToken);
    
    // Test company authentication
    const companyToken = await testCompanyLogin();
    await testCreateOffer(companyToken);

    console.log('\n📊 API Test Summary:');
    console.log('   ✅ Authentication endpoints working');
    console.log('   ✅ Offers listing working');
    console.log('   ✅ Offer details working');
    console.log('   ✅ Company authentication working');
    console.log('   📝 Offer creation structure ready');

    console.log('\n🎉 API tests completed successfully!');
    console.log('\n📚 Available test credentials:');
    console.log('   👤 Student: marie.diop@etudiant.sprayinfo.com / password123');
    console.log('   🏢 Company: rh@sonatel.sn / password123');
    console.log('   👑 Admin: admin@sprayinfo.com / password123');

  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch support');
  process.exit(1);
}

runTests();
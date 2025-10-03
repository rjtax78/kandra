// Using Node.js native fetch (available in Node 18+)

const BASE_URL = 'http://localhost:5000/api';

// Test user credentials - using actual test company from RedirectionTest
const TEST_COMPANY = {
  email: 'company1759477498591@test.com',
  password: 'TestPassword123'
};

let authToken = null;
let userId = null;

async function login() {
  try {
    console.log('🔐 Attempting to login as company...');
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_COMPANY)
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      authToken = data.token;
      userId = data.user.id;
      console.log('✅ Login successful');
      console.log('🏢 Company:', data.user.raisonSociale || data.user.prenom);
      console.log('🆔 User ID:', userId);
      console.log('🎫 Token obtained');
      return true;
    } else {
      console.error('❌ Login failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return false;
  }
}

async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    console.log(`\n🔍 Testing ${method} ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - Success (${response.status})`);
      if (result.offers) {
        console.log(`📊 Found ${result.offers.length} offers`);
      } else if (result.totalOffers !== undefined) {
        console.log(`📊 Stats: ${result.totalOffers} total offers, ${result.activeOffers} active`);
      } else if (result.message) {
        console.log(`💬 Message: ${result.message}`);
      } else if (result.id) {
        console.log(`🆔 Created with ID: ${result.id}`);
      }
      return { success: true, data: result };
    } else {
      console.log(`❌ ${method} ${endpoint} - Error (${response.status}): ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Network Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Company Dashboard API Tests');
  console.log('==========================================');

  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Step 2: Test company stats
  await testAPI('/opportunites/company/stats');

  // Step 3: Test company offers
  await testAPI('/opportunites/company/offers');

  // Step 4: Create a test job
  const testJob = {
    titre: 'Node.js Backend Developer',
    description: 'We are looking for a skilled Node.js developer to join our team',
    typeOffre: 'emploi',
    localisation: 'Paris, France',
    salaire: '50000-70000 EUR',
    niveauEtude: 'Bachelor degree or equivalent',
    competencesRequises: 'Node.js, Express, MongoDB, REST APIs',
    dateExpiration: '2024-12-31',
    nombrePostes: 2,
    statut: 'brouillon',
    entrepriseId: userId,
    typeContrat: 'CDI',
    experienceRequise: '3-5 years',
    avantages: 'Health insurance, Flexible hours, Remote work',
    estNegociable: true
  };

  const createResult = await testAPI('/opportunites', 'POST', testJob);
  let jobId = null;

  if (createResult.success && createResult.data.id) {
    jobId = createResult.data.id;
    
    // Step 5: Update the created job
    const updateData = {
      titre: 'Senior Node.js Backend Developer',
      statut: 'publiee',
      salaire: '60000-80000 EUR'
    };
    await testAPI(`/opportunites/${jobId}`, 'PUT', updateData);

    // Step 6: Create an internship
    const testInternship = {
      titre: 'Frontend Development Internship',
      description: 'Join our team as a frontend development intern',
      typeOffre: 'stage',
      localisation: 'Lyon, France',
      niveauEtude: 'Bachelor student',
      competencesRequises: 'React, JavaScript, CSS, Git',
      dateExpiration: '2024-11-30',
      nombrePostes: 1,
      statut: 'publiee',
      entrepriseId: userId,
      duree: '6 months',
      estRemunere: true,
      montantRemuneration: '800',
      dateDebut: '2024-09-01',
      objectifs: 'Learn modern frontend development and contribute to real projects'
    };

    const internshipResult = await testAPI('/opportunites', 'POST', testInternship);

    // Step 7: Check updated stats
    console.log('\n📊 Checking updated statistics...');
    await testAPI('/opportunites/company/stats');
    await testAPI('/opportunites/company/offers');

    // Step 8: Cleanup - delete the test offers
    console.log('\n🧹 Cleaning up test data...');
    await testAPI(`/opportunites/${jobId}`, 'DELETE');
    
    if (internshipResult.success && internshipResult.data.id) {
      await testAPI(`/opportunites/${internshipResult.data.id}`, 'DELETE');
    }
  }

  console.log('\n🏁 All tests completed!');
  console.log('==========================================');
}

// Run the tests
runTests().catch(console.error);
// Test script to check and seed applications data

import { db } from './src/db/drizzle.js';
import { candidatures, offres, users, etudiants, entreprises } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

async function testApplicationsData() {
  try {
    console.log('🔍 Checking applications data...');
    
    // Check if we have any applications
    const applications = await db.select().from(candidatures).limit(5);
    console.log('📊 Found applications:', applications.length);
    
    if (applications.length > 0) {
      console.log('✅ Applications exist:', applications.map(app => ({
        id: app.id,
        status: app.statut,
        date: app.dateCandidature
      })));
      
      // Get related job and candidate info
      for (const app of applications.slice(0, 2)) {
        const job = await db.select().from(offres).where(eq(offres.id, app.offreId));
        const student = await db.select().from(etudiants).where(eq(etudiants.id, app.etudiantId));
        const user = student.length > 0 ? await db.select().from(users).where(eq(users.id, student[0].id)) : [];
        
        console.log(`📋 Application ${app.id}:`);
        console.log(`  Job: ${job[0]?.titre || 'Unknown'}`);
        console.log(`  Candidate: ${user[0]?.prenom || 'Unknown'} ${user[0]?.nom || 'Unknown'}`);
        console.log(`  Status: ${app.statut}`);
        console.log(`  Date: ${app.dateCandidature}`);
        console.log('---');
      }
    } else {
      console.log('⚠️ No applications found in database');
      
      // Check if we have students and companies to create test data
      const students = await db.select().from(etudiants).limit(3);
      const companies = await db.select().from(entreprises).limit(3);
      const jobs = await db.select().from(offres).limit(3);
      
      console.log(`📊 Found ${students.length} students, ${companies.length} companies, ${jobs.length} jobs`);
      
      if (students.length > 0 && jobs.length > 0) {
        console.log('🎯 Creating test applications...');
        
        // Create some test applications
        const testApplications = [];
        
        for (let i = 0; i < Math.min(students.length, jobs.length, 3); i++) {
          testApplications.push({
            offreId: jobs[i].id,
            etudiantId: students[i].id,
            statut: ['soumise', 'en_cours', 'acceptee'][i] || 'soumise',
            lettreMotivation: `Lettre de motivation pour ${jobs[i].titre}. Je suis très intéressé(e) par cette opportunité...`,
            dateCandidature: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        if (testApplications.length > 0) {
          await db.insert(candidatures).values(testApplications);
          console.log(`✅ Created ${testApplications.length} test applications`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking applications data:', error);
  }
}

testApplicationsData();
#!/usr/bin/env node

/**
 * KANDRA Database Seeder
 * Populates the database with test data for development
 */

import { db } from './src/db/drizzle.js';
import { 
  users, 
  etudiants, 
  entreprises, 
  competences, 
  offres, 
  offresStage, 
  offresEmploi,
  candidatures,
  etudiantCompetences,
  offreCompetences,
  favoris,
  notifications
} from './src/db/schema.js';
import bcrypt from 'bcryptjs';

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  try {
    // Delete in correct order (respecting foreign keys)
    await db.delete(favoris);
    await db.delete(notifications);
    await db.delete(candidatures);
    await db.delete(offreCompetences);
    await db.delete(etudiantCompetences);
    await db.delete(offresStage);
    await db.delete(offresEmploi);
    await db.delete(offres);
    await db.delete(etudiants);
    await db.delete(entreprises);
    await db.delete(competences);
    await db.delete(users);
    
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.warn('⚠️  Warning clearing database:', error.message);
  }
}

async function seedCompetences() {
  console.log('🎯 Seeding competences...');
  
  const competencesData = [
    // Programmation
    { nom: 'JavaScript', categorie: 'Programmation' },
    { nom: 'TypeScript', categorie: 'Programmation' },
    { nom: 'Python', categorie: 'Programmation' },
    { nom: 'Java', categorie: 'Programmation' },
    { nom: 'C#', categorie: 'Programmation' },
    { nom: 'PHP', categorie: 'Programmation' },
    { nom: 'Go', categorie: 'Programmation' },
    
    // Frontend
    { nom: 'React', categorie: 'Frontend' },
    { nom: 'Vue.js', categorie: 'Frontend' },
    { nom: 'Angular', categorie: 'Frontend' },
    { nom: 'HTML/CSS', categorie: 'Frontend' },
    { nom: 'Tailwind CSS', categorie: 'Frontend' },
    { nom: 'SASS/SCSS', categorie: 'Frontend' },
    
    // Backend
    { nom: 'Node.js', categorie: 'Backend' },
    { nom: 'Express.js', categorie: 'Backend' },
    { nom: 'Django', categorie: 'Backend' },
    { nom: 'Spring Boot', categorie: 'Backend' },
    { nom: 'Laravel', categorie: 'Backend' },
    
    // Base de données
    { nom: 'MySQL', categorie: 'Base de données' },
    { nom: 'PostgreSQL', categorie: 'Base de données' },
    { nom: 'MongoDB', categorie: 'Base de données' },
    { nom: 'Redis', categorie: 'Base de données' },
    
    // DevOps
    { nom: 'Docker', categorie: 'DevOps' },
    { nom: 'Kubernetes', categorie: 'DevOps' },
    { nom: 'AWS', categorie: 'DevOps' },
    { nom: 'Azure', categorie: 'DevOps' },
    { nom: 'Git', categorie: 'DevOps' },
    
    // Soft Skills
    { nom: 'Communication', categorie: 'Soft Skills' },
    { nom: 'Travail en équipe', categorie: 'Soft Skills' },
    { nom: 'Leadership', categorie: 'Soft Skills' },
    { nom: 'Gestion de projet', categorie: 'Management' },
    { nom: 'Méthodes Agiles', categorie: 'Management' },
  ];
  
  for (const comp of competencesData) {
    await db.insert(competences).values(comp);
  }
  
  console.log(`✅ Created ${competencesData.length} competences`);
  return await db.select().from(competences);
}

async function seedUsers() {
  console.log('👤 Seeding users...');
  
  const password = await bcrypt.hash('password123', 10);
  
  const usersData = [
    // Admin
    {
      email: 'admin@sprayinfo.com',
      password,
      nom: 'Admin',
      prenom: 'System',
      telephone: '+221771234567',
      role: 'admin'
    },
    
    // Étudiants
    {
      email: 'marie.diop@etudiant.sprayinfo.com',
      password,
      nom: 'Diop',
      prenom: 'Marie',
      telephone: '+221771234568',
      role: 'etudiant'
    },
    {
      email: 'amadou.kane@etudiant.sprayinfo.com',
      password,
      nom: 'Kane',
      prenom: 'Amadou',
      telephone: '+221771234569',
      role: 'etudiant'
    },
    {
      email: 'fatou.sall@etudiant.sprayinfo.com',
      password,
      nom: 'Sall',
      prenom: 'Fatou',
      telephone: '+221771234570',
      role: 'etudiant'
    },
    {
      email: 'ibrahima.ndiaye@etudiant.sprayinfo.com',
      password,
      nom: 'Ndiaye',
      prenom: 'Ibrahima',
      telephone: '+221771234571',
      role: 'etudiant'
    },
    
    // Entreprises
    {
      email: 'rh@sonatel.sn',
      password,
      nom: 'Diallo',
      prenom: 'Aminata',
      telephone: '+221338901234',
      role: 'entreprise'
    },
    {
      email: 'recrutement@orange.sn',
      password,
      nom: 'Fall',
      prenom: 'Moussa',
      telephone: '+221338901235',
      role: 'entreprise'
    },
    {
      email: 'jobs@wavecom.sn',
      password,
      nom: 'Mbaye',
      prenom: 'Khady',
      telephone: '+221338901236',
      role: 'entreprise'
    },
    {
      email: 'carriere@expresso.sn',
      password,
      nom: 'Ba',
      prenom: 'Oumar',
      telephone: '+221338901237',
      role: 'entreprise'
    }
  ];
  
  for (const userData of usersData) {
    await db.insert(users).values(userData);
  }
  
  console.log(`✅ Created ${usersData.length} users`);
  return await db.select().from(users);
}

async function seedEtudiants(allUsers) {
  console.log('🎓 Seeding étudiants...');
  
  const etudiantUsers = allUsers.filter(u => u.role === 'etudiant');
  
  const etudiantsData = [
    {
      id: etudiantUsers[0].id,
      matricule: 'ET2024001',
      niveau: 'Master 2',
      filiere: 'Informatique - Développement Web',
      dateNaissance: new Date('2000-05-15')
    },
    {
      id: etudiantUsers[1].id,
      matricule: 'ET2024002',
      niveau: 'Master 1',
      filiere: 'Informatique - Data Science',
      dateNaissance: new Date('2001-03-22')
    },
    {
      id: etudiantUsers[2].id,
      matricule: 'ET2024003',
      niveau: 'Licence 3',
      filiere: 'Télécommunications',
      dateNaissance: new Date('2002-08-10')
    },
    {
      id: etudiantUsers[3].id,
      matricule: 'ET2024004',
      niveau: 'Master 2',
      filiere: 'Génie Logiciel',
      dateNaissance: new Date('1999-12-05')
    }
  ];
  
  for (const etudiantData of etudiantsData) {
    await db.insert(etudiants).values(etudiantData);
  }
  
  console.log(`✅ Created ${etudiantsData.length} étudiants`);
  return await db.select().from(etudiants);
}

async function seedEntreprises(allUsers) {
  console.log('🏢 Seeding entreprises...');
  
  const entrepriseUsers = allUsers.filter(u => u.role === 'entreprise');
  
  const entreprisesData = [
    {
      id: entrepriseUsers[0].id,
      raisonSociale: 'Sonatel SA',
      secteurActivite: 'Télécommunications',
      adresse: 'Avenue Léopold Sédar Senghor, Dakar, Sénégal',
      siteWeb: 'https://www.sonatel.sn',
      description: 'Leader des télécommunications au Sénégal, Sonatel propose des solutions innovantes en téléphonie, internet et services numériques.',
      isPartenaire: 1,
      datePartenariat: new Date('2020-01-15')
    },
    {
      id: entrepriseUsers[1].id,
      raisonSociale: 'Orange Sénégal',
      secteurActivite: 'Télécommunications',
      adresse: 'Rue 2 x Corniche Ouest, Dakar, Sénégal',
      siteWeb: 'https://www.orange.sn',
      description: 'Opérateur de télécommunications offrant des services mobiles, internet et solutions d\'entreprise.',
      isPartenaire: 1,
      datePartenariat: new Date('2020-03-10')
    },
    {
      id: entrepriseUsers[2].id,
      raisonSociale: 'Wave Sénégal',
      secteurActivite: 'FinTech',
      adresse: 'Almadies, Dakar, Sénégal',
      siteWeb: 'https://www.wave.com',
      description: 'Solution de paiement mobile révolutionnaire, Wave démocratise l\'accès aux services financiers.',
      isPartenaire: 1,
      datePartenariat: new Date('2021-06-20')
    },
    {
      id: entrepriseUsers[3].id,
      raisonSociale: 'Expresso Sénégal',
      secteurActivite: 'Télécommunications',
      adresse: 'Immeuble Khadim Rassoul, Dakar, Sénégal',
      siteWeb: 'https://www.expresso.sn',
      description: 'Opérateur télécom proposant des services innovants en téléphonie mobile et internet.',
      isPartenaire: 0,
      datePartenariat: null
    }
  ];
  
  for (const entrepriseData of entreprisesData) {
    await db.insert(entreprises).values(entrepriseData);
  }
  
  console.log(`✅ Created ${entreprisesData.length} entreprises`);
  return await db.select().from(entreprises);
}

async function seedEtudiantCompetences(allEtudiants, allCompetences) {
  console.log('🔗 Seeding étudiant-compétences...');
  
  const etudiantCompetencesData = [];
  
  // Marie Diop - Développement Web
  const marie = allEtudiants[0];
  const webSkills = allCompetences.filter(c => 
    ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'MySQL'].includes(c.nom)
  );
  for (const skill of webSkills) {
    etudiantCompetencesData.push({
      etudiantId: marie.id,
      competenceId: skill.id,
      niveau: 'avance'
    });
  }
  
  // Amadou Kane - Data Science
  const amadou = allEtudiants[1];
  const dataSkills = allCompetences.filter(c => 
    ['Python', 'JavaScript', 'MySQL', 'MongoDB'].includes(c.nom)
  );
  for (const skill of dataSkills) {
    etudiantCompetencesData.push({
      etudiantId: amadou.id,
      competenceId: skill.id,
      niveau: 'intermediaire'
    });
  }
  
  // Fatou Sall - Télécommunications
  const fatou = allEtudiants[2];
  const telecomSkills = allCompetences.filter(c => 
    ['Java', 'Python', 'Communication', 'Gestion de projet'].includes(c.nom)
  );
  for (const skill of telecomSkills) {
    etudiantCompetencesData.push({
      etudiantId: fatou.id,
      competenceId: skill.id,
      niveau: 'intermediaire'
    });
  }
  
  // Ibrahima Ndiaye - Génie Logiciel
  const ibrahima = allEtudiants[3];
  const softwareSkills = allCompetences.filter(c => 
    ['Java', 'Spring Boot', 'Docker', 'Git', 'Méthodes Agiles'].includes(c.nom)
  );
  for (const skill of softwareSkills) {
    etudiantCompetencesData.push({
      etudiantId: ibrahima.id,
      competenceId: skill.id,
      niveau: 'avance'
    });
  }
  
  for (const data of etudiantCompetencesData) {
    await db.insert(etudiantCompetences).values(data);
  }
  
  console.log(`✅ Created ${etudiantCompetencesData.length} étudiant-compétences`);
}

async function seedOffres(allEntreprises) {
  console.log('💼 Seeding offres...');
  
  const offresData = [
    // Sonatel - Stage
    {
      entrepriseId: allEntreprises[0].id,
      titre: 'Stage Développeur Full Stack',
      description: 'Rejoignez notre équipe de développement pour contribuer à la modernisation de nos plateformes digitales. Vous travaillerez sur des projets React/Node.js et participerez à l\'amélioration de l\'expérience utilisateur.',
      typeOffre: 'stage',
      localisation: 'Dakar, Sénégal',
      niveauEtude: 'Master 1/2',
      competencesRequises: 'JavaScript, React, Node.js, MySQL',
      dateExpiration: new Date('2025-03-30'),
      statut: 'publiee',
      nombrePostes: 2,
      salaire: '150 000 - 200 000 FCFA/mois'
    },
    
    // Orange - Emploi
    {
      entrepriseId: allEntreprises[1].id,
      titre: 'Développeur Backend Senior',
      description: 'Nous recherchons un développeur backend expérimenté pour renforcer notre équipe technique. Vous serez responsable du développement et de la maintenance de nos APIs et microservices.',
      typeOffre: 'emploi',
      localisation: 'Dakar, Sénégal',
      niveauEtude: 'Master 2 ou équivalent',
      competencesRequises: 'Java, Spring Boot, Docker, Kubernetes, PostgreSQL',
      dateExpiration: new Date('2025-04-15'),
      statut: 'publiee',
      nombrePostes: 1,
      salaire: '800 000 - 1 200 000 FCFA/mois'
    },
    
    // Wave - Stage
    {
      entrepriseId: allEntreprises[2].id,
      titre: 'Stage Data Analyst',
      description: 'Opportunité unique de rejoindre l\'équipe data de Wave pour analyser les tendances de paiement mobile et contribuer à l\'amélioration de nos algorithmes de recommandation.',
      typeOffre: 'stage',
      localisation: 'Dakar, Sénégal',
      niveauEtude: 'Master 1/2',
      competencesRequises: 'Python, SQL, Machine Learning, Data Visualization',
      dateExpiration: new Date('2025-05-20'),
      statut: 'publiee',
      nombrePostes: 1,
      salaire: '180 000 FCFA/mois'
    },
    
    // Expresso - Emploi
    {
      entrepriseId: allEntreprises[3].id,
      titre: 'Chef de Projet Digital',
      description: 'Poste de chef de projet pour piloter la transformation digitale d\'Expresso. Vous coordonnerez les équipes techniques et business pour livrer des solutions innovantes.',
      typeOffre: 'emploi',
      localisation: 'Dakar, Sénégal',
      niveauEtude: 'Master 2',
      competencesRequises: 'Gestion de projet, Méthodes Agiles, Leadership, Communication',
      dateExpiration: new Date('2025-06-30'),
      statut: 'publiee',
      nombrePostes: 1,
      salaire: '1 000 000 - 1 500 000 FCFA/mois'
    },
    
    // Orange - Stage
    {
      entrepriseId: allEntreprises[1].id,
      titre: 'Stage DevOps Engineer',
      description: 'Stage en ingénierie DevOps pour automatiser nos processus de déploiement et améliorer notre infrastructure cloud.',
      typeOffre: 'stage',
      localisation: 'Dakar, Sénégal',
      niveauEtude: 'Master 1/2',
      competencesRequises: 'Docker, Kubernetes, AWS, Git, Linux',
      dateExpiration: new Date('2025-04-30'),
      statut: 'publiee',
      nombrePostes: 1,
      salaire: '200 000 FCFA/mois'
    }
  ];
  
  for (const offreData of offresData) {
    await db.insert(offres).values(offreData);
  }
  
  console.log(`✅ Created ${offresData.length} offres`);
  return await db.select().from(offres);
}

async function seedOffresDetails(allOffres) {
  console.log('📋 Seeding offres details...');
  
  const stages = allOffres.filter(o => o.typeOffre === 'stage');
  const emplois = allOffres.filter(o => o.typeOffre === 'emploi');
  
  // Détails des stages
  const stageDetails = [
    {
      id: stages[0].id, // Sonatel Stage
      duree: '6 mois',
      estRemunere: 1,
      montantRemuneration: 175000.00,
      dateDebut: new Date('2025-02-01'),
      objectifs: 'Développer des compétences en développement full stack, participer à des projets concrets, découvrir l\'environnement professionnel des télécoms.'
    },
    {
      id: stages[1].id, // Wave Stage
      duree: '4 mois',
      estRemunere: 1,
      montantRemuneration: 180000.00,
      dateDebut: new Date('2025-03-01'),
      objectifs: 'Maîtriser les outils d\'analyse de données, comprendre les enjeux du paiement mobile, contribuer à l\'amélioration des algorithmes.'
    },
    {
      id: stages[2].id, // Orange DevOps Stage
      duree: '6 mois',
      estRemunere: 1,
      montantRemuneration: 200000.00,
      dateDebut: new Date('2025-02-15'),
      objectifs: 'Acquérir une expertise en DevOps, automatiser les processus, gérer l\'infrastructure cloud.'
    }
  ];
  
  for (const detail of stageDetails) {
    await db.insert(offresStage).values(detail);
  }
  
  // Détails des emplois
  const emploiDetails = [
    {
      id: emplois[0].id, // Orange Backend
      typeContrat: 'CDI',
      experienceRequise: '3-5 ans',
      avantages: 'Assurance santé, tickets restaurant, formation continue, télétravail partiel',
      estNegociable: 1
    },
    {
      id: emplois[1].id, // Expresso Chef de projet
      typeContrat: 'CDI',
      experienceRequise: '5+ ans',
      avantages: 'Package complet, voiture de fonction, bonus performance, formation leadership',
      estNegociable: 1
    }
  ];
  
  for (const detail of emploiDetails) {
    await db.insert(offresEmploi).values(detail);
  }
  
  console.log(`✅ Created stage and emploi details`);
}

async function seedCandidatures(allEtudiants, allOffres) {
  console.log('📝 Seeding candidatures...');
  
  const candidaturesData = [
    {
      offreId: allOffres[0].id, // Sonatel Stage
      etudiantId: allEtudiants[0].id, // Marie
      statut: 'soumise',
      lettreMotivation: 'Madame, Monsieur, Étudiante en Master 2 Développement Web, je suis très intéressée par ce stage chez Sonatel...',
      cvJoint: 'cv_marie_diop.pdf'
    },
    {
      offreId: allOffres[0].id, // Sonatel Stage
      etudiantId: allEtudiants[3].id, // Ibrahima
      statut: 'en_cours',
      lettreMotivation: 'Bonjour, Fort de mon expérience en génie logiciel, je souhaiterais contribuer à vos projets...',
      cvJoint: 'cv_ibrahima_ndiaye.pdf'
    },
    {
      offreId: allOffres[2].id, // Wave Stage
      etudiantId: allEtudiants[1].id, // Amadou
      statut: 'acceptee',
      lettreMotivation: 'Passionné par la data science et les FinTech, je serais ravi de rejoindre Wave...',
      cvJoint: 'cv_amadou_kane.pdf'
    },
    {
      offreId: allOffres[1].id, // Orange Emploi
      etudiantId: allEtudiants[3].id, // Ibrahima
      statut: 'soumise',
      lettreMotivation: 'Diplômé en génie logiciel avec une expertise en Java/Spring, je postule pour le poste...',
      cvJoint: 'cv_ibrahima_ndiaye.pdf'
    }
  ];
  
  for (const candidatureData of candidaturesData) {
    await db.insert(candidatures).values(candidatureData);
  }
  
  console.log(`✅ Created ${candidaturesData.length} candidatures`);
}

async function seedFavoris(allEtudiants, allOffres) {
  console.log('❤️  Seeding favoris...');
  
  const favorisData = [
    {
      etudiantId: allEtudiants[0].id, // Marie
      offreId: allOffres[1].id // Orange Backend
    },
    {
      etudiantId: allEtudiants[0].id, // Marie
      offreId: allOffres[4].id // Orange DevOps Stage
    },
    {
      etudiantId: allEtudiants[2].id, // Fatou
      offreId: allOffres[3].id // Expresso Chef de projet
    }
  ];
  
  for (const favoriData of favorisData) {
    await db.insert(favoris).values(favoriData);
  }
  
  console.log(`✅ Created ${favorisData.length} favoris`);
}

async function seedNotifications(allUsers) {
  console.log('🔔 Seeding notifications...');
  
  const etudiantUsers = allUsers.filter(u => u.role === 'etudiant');
  const entrepriseUsers = allUsers.filter(u => u.role === 'entreprise');
  
  const notificationsData = [
    {
      userId: etudiantUsers[0].id,
      type: 'candidature',
      contenu: 'Votre candidature pour le poste "Stage Développeur Full Stack" chez Sonatel a été reçue.',
      priorite: 'normale'
    },
    {
      userId: etudiantUsers[1].id,
      type: 'acceptation',
      contenu: 'Félicitations ! Votre candidature pour le stage chez Wave a été acceptée.',
      priorite: 'haute'
    },
    {
      userId: entrepriseUsers[0].id,
      type: 'nouvelle_candidature',
      contenu: 'Nouvelle candidature reçue pour votre offre "Stage Développeur Full Stack".',
      priorite: 'normale'
    },
    {
      userId: etudiantUsers[2].id,
      type: 'nouvelle_offre',
      contenu: 'Une nouvelle offre correspondant à votre profil a été publiée : "Chef de Projet Digital".',
      priorite: 'normale'
    }
  ];
  
  for (const notifData of notificationsData) {
    await db.insert(notifications).values(notifData);
  }
  
  console.log(`✅ Created ${notificationsData.length} notifications`);
}

async function runSeeder() {
  try {
    console.log('🌱 Starting KANDRA database seeding...\n');
    
    // Clear existing data
    await clearDatabase();
    
    // Seed base data
    const allCompetences = await seedCompetences();
    const allUsers = await seedUsers();
    const allEtudiants = await seedEtudiants(allUsers);
    const allEntreprises = await seedEntreprises(allUsers);
    
    // Seed relationships
    await seedEtudiantCompetences(allEtudiants, allCompetences);
    
    // Seed offers and details
    const allOffres = await seedOffres(allEntreprises);
    await seedOffresDetails(allOffres);
    
    // Seed applications and interactions
    await seedCandidatures(allEtudiants, allOffres);
    await seedFavoris(allEtudiants, allOffres);
    await seedNotifications(allUsers);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👤 Users: ${allUsers.length} (1 admin, ${allEtudiants.length} étudiants, ${allEntreprises.length} entreprises)`);
    console.log(`   🎯 Competences: ${allCompetences.length}`);
    console.log(`   💼 Offres: ${allOffres.length} (3 stages, 2 emplois)`);
    console.log('   📝 Sample candidatures, favoris, and notifications created');
    
    console.log('\n🔐 Test Login Credentials:');
    console.log('   Admin: admin@sprayinfo.com / password123');
    console.log('   Étudiant: marie.diop@etudiant.sprayinfo.com / password123');
    console.log('   Entreprise: rh@sonatel.sn / password123');
    
    console.log('\n🚀 You can now start testing the API endpoints!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeder();
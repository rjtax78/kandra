import { db } from '../db/drizzle.js';
import { etudiants, users, etudiantCompetences, competences, candidatures, offres, entreprises } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export async function updateProfilEtudiant(req, res) {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    console.log('Profile update request for user:', userId);
    console.log('Profile data received:', profileData);

    // First, check if user exists in users table
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (userExists.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Update user basic information in users table
    const userUpdateData = {};
    if (profileData.firstName) userUpdateData.prenom = profileData.firstName;
    if (profileData.lastName) userUpdateData.nom = profileData.lastName;
    if (profileData.email) userUpdateData.email = profileData.email;
    if (profileData.phone) userUpdateData.telephone = profileData.phone;

    if (Object.keys(userUpdateData).length > 0) {
      await db.update(users)
        .set(userUpdateData)
        .where(eq(users.id, userId));
    }

    // Check if student profile exists
    const etudiantExist = await db.select()
      .from(etudiants)
      .where(eq(etudiants.id, userId));
    
    // Student-specific information
    const etudiantUpdateData = {};
    if (profileData.level) etudiantUpdateData.niveau = profileData.level;
    if (profileData.field) etudiantUpdateData.filiere = profileData.field;
    if (profileData.university) {
      // Store university as part of competences JSON or add to schema later
      const currentCompetences = etudiantExist[0]?.competences ? 
        JSON.parse(etudiantExist[0].competences) : {};
      currentCompetences.university = profileData.university;
      etudiantUpdateData.competences = JSON.stringify(currentCompetences);
    }
    if (profileData.graduationYear) {
      const currentCompetences = etudiantExist[0]?.competences ? 
        JSON.parse(etudiantExist[0].competences || '{}') : {};
      currentCompetences.graduationYear = profileData.graduationYear;
      etudiantUpdateData.competences = JSON.stringify(currentCompetences);
    }
    if (profileData.bio) {
      const currentCompetences = etudiantExist[0]?.competences ? 
        JSON.parse(etudiantExist[0].competences || '{}') : {};
      currentCompetences.bio = profileData.bio;
      currentCompetences.jobTitle = profileData.jobTitle;
      currentCompetences.location = profileData.location;
      // Store social links
      currentCompetences.socialLinks = {
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        portfolio: profileData.portfolio || '',
        website: profileData.website || ''
      };
      // Store skills and languages
      if (profileData.skills) currentCompetences.skills = profileData.skills;
      if (profileData.languages) currentCompetences.languages = profileData.languages;
      if (profileData.projects) currentCompetences.projects = profileData.projects;
      if (profileData.certifications) currentCompetences.certifications = profileData.certifications;
      
      etudiantUpdateData.competences = JSON.stringify(currentCompetences);
    }

    if (etudiantExist.length === 0) {
      // Create new student profile if it doesn't exist
      const newStudentData = {
        id: userId,
        matricule: `STU_${Date.now()}`, // Generate a unique matricule
        niveau: profileData.level || 'Licence 1',
        filiere: profileData.field || 'Non spécifié',
        ...etudiantUpdateData
      };
      
      await db.insert(etudiants).values(newStudentData);
      console.log('Created new student profile for user:', userId);
    } else if (Object.keys(etudiantUpdateData).length > 0) {
      // Update existing student profile
      await db.update(etudiants)
        .set(etudiantUpdateData)
        .where(eq(etudiants.id, userId));
      console.log('Updated existing student profile for user:', userId);
    }

    // Handle skills as competences if provided separately (legacy support)
    if (profileData.competences && Array.isArray(profileData.competences)) {
      // Supprimer les anciennes compétences
      await db.delete(etudiantCompetences)
        .where(eq(etudiantCompetences.etudiantId, userId));

      // Ajouter les nouvelles compétences
      for (const competenceData of profileData.competences) {
        await db.insert(etudiantCompetences).values({
          etudiantId: userId,
          competenceId: competenceData.competenceId,
          niveau: competenceData.niveau || 'intermediaire'
        });
      }
    }

    // Récupérer le profil mis à jour
    const profilMisAJour = await getProfilComplet(userId);

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      profil: profilMisAJour
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la mise à jour du profil',
      details: err.message 
    });
  }
}

export async function getMonProfil(req, res) {
  try {
    const userId = req.user.id;
    
    const profil = await getProfilComplet(userId);
    
    if (!profil) {
      return res.status(404).json({ error: 'Profil étudiant non trouvé' });
    }

    res.json(profil);
  } catch (err) {
    console.error('Erreur lors de la récupération du profil:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil' });
  }
}

export async function listEtudiants(req, res) {
  try {
    const { niveau, filiere, limit = 50 } = req.query;

    let query = db.select({
      id: etudiants.id,
      matricule: etudiants.matricule,
      niveau: etudiants.niveau,
      filiere: etudiants.filiere,
      dateNaissance: etudiants.dateNaissance,
      photoProfile: etudiants.photoProfile,
      // Informations utilisateur
      nom: users.nom,
      prenom: users.prenom,
      email: users.email,
      telephone: users.telephone,
      dateInscription: users.dateInscription
    })
    .from(etudiants)
    .leftJoin(users, eq(etudiants.id, users.id))
    .limit(parseInt(limit));

    // Appliquer les filtres
    if (niveau) {
      query = query.where(eq(etudiants.niveau, niveau));
    }
    if (filiere) {
      query = query.where(eq(etudiants.filiere, filiere));
    }

    const etudiants_list = await query;

    res.json({
      etudiants: etudiants_list,
      total: etudiants_list.length
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des étudiants:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des étudiants' });
  }
}

export async function getEtudiant(req, res) {
  try {
    const etudiantId = req.params.id;
    
    const profil = await getProfilComplet(etudiantId);
    
    if (!profil) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }

    res.json(profil);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'étudiant:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'étudiant' });
  }
}

// Legacy functions for backward compatibility
export async function createCandidat(req, res) {
  try {
    // This would be handled by the registration process now
    return updateProfilEtudiant(req, res);
  } catch (err) {
    console.error('Erreur lors de la création du candidat:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la création du candidat' });
  }
}

export async function listCandidats(req, res) {
  try {
    return listEtudiants(req, res);
  } catch (err) {
    console.error('Erreur lors de la récupération des candidats:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des candidats' });
  }
}

export async function getCandidat(req, res) {
  try {
    return getEtudiant(req, res);
  } catch (err) {
    console.error('Erreur lors de la récupération du candidat:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du candidat' });
  }
}

export async function getStatistiquesEtudiant(req, res) {
  try {
    const userId = req.user.id;

    // Vérifier que l'utilisateur est un étudiant
    const etudiant = await db.select()
      .from(etudiants)
      .where(eq(etudiants.id, userId));
    
    if (etudiant.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux étudiants' });
    }

    // Compter les candidatures par statut
    const candidaturesStats = await db.select({
      statut: candidatures.statut,
      count: candidatures.id
    })
    .from(candidatures)
    .where(eq(candidatures.etudiantId, userId));

    // Statistiques des candidatures
    const stats = {
      totalCandidatures: candidaturesStats.length,
      candidaturesParStatut: candidaturesStats.reduce((acc, curr) => {
        acc[curr.statut] = (acc[curr.statut] || 0) + 1;
        return acc;
      }, {}),
      profilComplet: !!(etudiant[0].matricule && etudiant[0].niveau && etudiant[0].filiere)
    };

    res.json(stats);
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
}

// Fonction utilitaire pour récupérer un profil complet
async function getProfilComplet(userId) {
  // Récupérer les informations de base
  const etudiantData = await db.select({
    id: etudiants.id,
    matricule: etudiants.matricule,
    niveau: etudiants.niveau,
    filiere: etudiants.filiere,
    dateNaissance: etudiants.dateNaissance,
    photoProfile: etudiants.photoProfile,
    competences: etudiants.competences,
    cv: etudiants.cv,
    // Informations utilisateur
    nom: users.nom,
    prenom: users.prenom,
    email: users.email,
    telephone: users.telephone,
    dateInscription: users.dateInscription,
    role: users.role,
    isActive: users.isActive
  })
  .from(etudiants)
  .leftJoin(users, eq(etudiants.id, users.id))
  .where(eq(etudiants.id, userId));

  if (etudiantData.length === 0) {
    return null;
  }

  const etudiant = etudiantData[0];

  // Récupérer les compétences de l'étudiant
  const competencesEtudiant = await db.select({
    competenceId: etudiantCompetences.competenceId,
    niveau: etudiantCompetences.niveau,
    dateAjout: etudiantCompetences.dateAjout,
    nomCompetence: competences.nom,
    categorieCompetence: competences.categorie
  })
  .from(etudiantCompetences)
  .leftJoin(competences, eq(etudiantCompetences.competenceId, competences.id))
  .where(eq(etudiantCompetences.etudiantId, userId));

  // Récupérer les statistiques de candidatures
  const totalCandidatures = await db.select()
    .from(candidatures)
    .where(eq(candidatures.etudiantId, userId));

  // Parse the competences JSON to extract additional profile data
  let parsedCompetences = {};
  try {
    parsedCompetences = etudiant.competences ? JSON.parse(etudiant.competences) : {};
  } catch (error) {
    console.error('Error parsing competences JSON:', error);
    parsedCompetences = {};
  }

  return {
    // Basic user info
    id: etudiant.id,
    firstName: etudiant.prenom,
    lastName: etudiant.nom,
    email: etudiant.email,
    phone: etudiant.telephone,
    
    // Academic info
    level: etudiant.niveau,
    field: etudiant.filiere,
    matricule: etudiant.matricule,
    university: parsedCompetences.university || '',
    graduationYear: parsedCompetences.graduationYear || '',
    
    // Profile info
    bio: parsedCompetences.bio || '',
    jobTitle: parsedCompetences.jobTitle || '',
    location: parsedCompetences.location || '',
    
    // Social links
    linkedin: parsedCompetences.socialLinks?.linkedin || '',
    github: parsedCompetences.socialLinks?.github || '',
    portfolio: parsedCompetences.socialLinks?.portfolio || '',
    website: parsedCompetences.socialLinks?.website || '',
    
    // Skills and other data
    skills: parsedCompetences.skills || [],
    languages: parsedCompetences.languages || [],
    projects: parsedCompetences.projects || [],
    certifications: parsedCompetences.certifications || [],
    
    // Database competences (legacy)
    databaseCompetences: competencesEtudiant,
    
    // Other fields
    photoProfile: etudiant.photoProfile,
    dateNaissance: etudiant.dateNaissance,
    cv: etudiant.cv,
    dateInscription: etudiant.dateInscription,
    role: etudiant.role,
    isActive: etudiant.isActive,
    
    // Statistics
    statistiques: {
      totalCandidatures: totalCandidatures.length
    }
  };
}

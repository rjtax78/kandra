import { db } from '../db/drizzle.js';
import { 
  candidatures, 
  offres, 
  etudiants, 
  users, 
  etudiantCompetences, 
  competences,
  entreprises 
} from '../db/schema.js';
import { eq, and, desc, sql, count, like, or, gte, lte } from 'drizzle-orm';

// Get all applications for a company's jobs
export async function getCompanyApplications(req, res) {
  try {
    const companyId = req.user.id;
    const { 
      jobId,
      status,
      search,
      experience,
      rating,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    console.log('Fetching applications for company:', companyId, 'with filters:', req.query);

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Base query to get applications for company's jobs
    let applicationsQuery = db.select({
      // Application details
      id: candidatures.id,
      dateCandidature: candidatures.dateCandidature,
      statut: candidatures.statut,
      lettreMotivation: candidatures.lettreMotivation,
      cvJoint: candidatures.cvJoint,
      commentaire: candidatures.commentaire,
      
      // Job details
      jobId: offres.id,
      jobTitle: offres.titre,
      jobType: offres.typeOffre,
      jobLocation: offres.localisation,
      
      // Student/candidate details
      candidateId: etudiants.id,
      candidateName: sql`CONCAT(${users.prenom}, ' ', ${users.nom})`.as('candidateName'),
      candidateEmail: users.email,
      candidatePhone: users.telephone,
      candidateLocation: sql`COALESCE(${etudiants.competences}, '{}')`.as('candidateLocation'),
      
      // Academic info
      niveau: etudiants.niveau,
      filiere: etudiants.filiere,
      matricule: etudiants.matricule,
      dateNaissance: etudiants.dateNaissance,
      photoProfile: etudiants.photoProfile,
      competencesJson: etudiants.competences,
      
      // User registration date
      dateInscription: users.dateInscription
    })
    .from(candidatures)
    .innerJoin(offres, eq(candidatures.offreId, offres.id))
    .innerJoin(etudiants, eq(candidatures.etudiantId, etudiants.id))
    .innerJoin(users, eq(etudiants.id, users.id))
    .where(eq(offres.entrepriseId, companyId))
    .limit(parseInt(limit))
    .offset(offset);

    // Apply filters
    const conditions = [eq(offres.entrepriseId, companyId)];
    
    if (jobId) {
      conditions.push(eq(offres.id, jobId));
    }
    
    if (status && status !== 'all') {
      conditions.push(eq(candidatures.statut, status));
    }
    
    if (search) {
      conditions.push(
        or(
          like(users.nom, `%${search}%`),
          like(users.prenom, `%${search}%`),
          like(users.email, `%${search}%`),
          like(etudiants.filiere, `%${search}%`),
          like(etudiants.competences, `%${search}%`)
        )
      );
    }

    // Apply all conditions
    applicationsQuery = applicationsQuery.where(and(...conditions));

    // Apply sorting
    switch (sortBy) {
      case 'name':
        applicationsQuery = applicationsQuery.orderBy(
          sortOrder === 'asc' ? users.prenom : desc(users.prenom)
        );
        break;
      case 'status':
        applicationsQuery = applicationsQuery.orderBy(
          sortOrder === 'asc' ? candidatures.statut : desc(candidatures.statut)
        );
        break;
      case 'date':
      default:
        applicationsQuery = applicationsQuery.orderBy(
          sortOrder === 'asc' ? candidatures.dateCandidature : desc(candidatures.dateCandidature)
        );
        break;
    }

    const applications = await applicationsQuery;

    // Get total count for pagination
    let countQuery = db.select({ count: count() })
      .from(candidatures)
      .innerJoin(offres, eq(candidatures.offreId, offres.id))
      .innerJoin(etudiants, eq(candidatures.etudiantId, etudiants.id))
      .innerJoin(users, eq(etudiants.id, users.id))
      .where(and(...conditions));

    const totalCount = await countQuery;

    // Get applications statistics
    const statsQuery = await db.select({
      statut: candidatures.statut,
      count: count()
    })
    .from(candidatures)
    .innerJoin(offres, eq(candidatures.offreId, offres.id))
    .where(eq(offres.entrepriseId, companyId))
    .groupBy(candidatures.statut);

    const stats = statsQuery.reduce((acc, stat) => {
      acc[stat.statut] = stat.count;
      return acc;
    }, {});

    // Transform applications for frontend
    const transformedApplications = await Promise.all(applications.map(async (app) => {
      // Parse competences JSON for additional info
      let competencesData = {};
      try {
        competencesData = app.competencesJson ? JSON.parse(app.competencesJson) : {};
      } catch (error) {
        console.warn('Failed to parse competences JSON for student:', app.candidateId);
      }

      // Get student's competences from the competences table
      const studentSkills = await db.select({
        nom: competences.nom,
        niveau: etudiantCompetences.niveau,
        categorie: competences.categorie
      })
      .from(etudiantCompetences)
      .innerJoin(competences, eq(etudiantCompetences.competenceId, competences.id))
      .where(eq(etudiantCompetences.etudiantId, app.candidateId));

      return {
        id: app.id,
        candidateId: app.candidateId,
        jobId: app.jobId,
        candidateName: app.candidateName,
        candidateEmail: app.candidateEmail,
        candidatePhone: app.candidatePhone,
        candidateLocation: competencesData.location || 'Non spécifié',
        candidatePhoto: app.photoProfile || null,
        position: app.jobTitle,
        appliedDate: app.dateCandidature,
        status: app.statut,
        rating: calculateCandidateRating(app, studentSkills, competencesData),
        experience: getExperienceLevel(competencesData),
        education: `${app.niveau || 'N/A'} en ${app.filiere || 'N/A'}`,
        resumeUrl: app.cvJoint,
        coverLetter: app.lettreMotivation,
        portfolio: competencesData.socialLinks?.portfolio || competencesData.portfolio,
        skills: studentSkills.map(skill => skill.nom),
        skillsDetails: studentSkills,
        notes: app.commentaire,
        interviewScheduled: null, // TODO: Add interview scheduling
        lastActivity: app.dateCandidature,
        jobDetails: {
          title: app.jobTitle,
          type: app.jobType,
          location: app.jobLocation
        },
        candidateDetails: {
          niveau: app.niveau,
          filiere: app.filiere,
          matricule: app.matricule,
          dateNaissance: app.dateNaissance,
          dateInscription: app.dateInscription,
          bio: competencesData.bio,
          socialLinks: competencesData.socialLinks || {}
        }
      };
    }));

    res.json({
      success: true,
      data: {
        applications: transformedApplications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount[0]?.count || 0,
          totalPages: Math.ceil((totalCount[0]?.count || 0) / parseInt(limit))
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching company applications:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des candidatures',
      details: error.message
    });
  }
}

// Update application status
export async function updateApplicationStatus(req, res) {
  try {
    const companyId = req.user.id;
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    console.log(`Updating application ${applicationId} status to:`, status);

    // Verify that the application belongs to a job posted by this company
    const applicationCheck = await db.select({
      candidatureId: candidatures.id,
      entrepriseId: offres.entrepriseId
    })
    .from(candidatures)
    .innerJoin(offres, eq(candidatures.offreId, offres.id))
    .where(eq(candidatures.id, applicationId));

    if (applicationCheck.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidature non trouvée'
      });
    }

    if (applicationCheck[0].entrepriseId !== companyId) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à cette candidature'
      });
    }

    // Update application status
    const updateData = {
      statut: status,
      updatedAt: new Date()
    };

    if (notes) {
      updateData.commentaire = notes;
    }

    await db.update(candidatures)
      .set(updateData)
      .where(eq(candidatures.id, applicationId));

    res.json({
      success: true,
      message: 'Statut de la candidature mis à jour avec succès'
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut',
      details: error.message
    });
  }
}

// Bulk update application statuses
export async function bulkUpdateApplications(req, res) {
  try {
    const companyId = req.user.id;
    const { applicationIds, status, notes } = req.body;

    console.log(`Bulk updating applications:`, applicationIds, 'to status:', status);

    // Verify all applications belong to this company
    const applicationsCheck = await db.select({
      candidatureId: candidatures.id,
      entrepriseId: offres.entrepriseId
    })
    .from(candidatures)
    .innerJoin(offres, eq(candidatures.offreId, offres.id))
    .where(sql`${candidatures.id} IN (${applicationIds.map(() => '?').join(',')})`, ...applicationIds);

    const unauthorizedApps = applicationsCheck.filter(app => app.entrepriseId !== companyId);
    if (unauthorizedApps.length > 0) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à certaines candidatures'
      });
    }

    // Update all applications
    const updateData = {
      statut: status,
      updatedAt: new Date()
    };

    if (notes) {
      updateData.commentaire = notes;
    }

    for (const appId of applicationIds) {
      await db.update(candidatures)
        .set(updateData)
        .where(eq(candidatures.id, appId));
    }

    res.json({
      success: true,
      message: `${applicationIds.length} candidature(s) mise(s) à jour avec succès`
    });

  } catch (error) {
    console.error('Error bulk updating applications:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour en masse',
      details: error.message
    });
  }
}

// Get company's job list for filtering
export async function getCompanyJobs(req, res) {
  try {
    const companyId = req.user.id;

    console.log('Fetching jobs for company:', companyId);

    const jobs = await db.select({
      id: offres.id,
      titre: offres.titre,
      typeOffre: offres.typeOffre,
      statut: offres.statut,
      datePublication: offres.datePublication,
      applicationCount: sql`COUNT(${candidatures.id})`.as('applicationCount')
    })
    .from(offres)
    .leftJoin(candidatures, eq(offres.id, candidatures.offreId))
    .where(eq(offres.entrepriseId, companyId))
    .groupBy(offres.id)
    .orderBy(desc(offres.datePublication));

    res.json({
      success: true,
      data: jobs
    });

  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des offres',
      details: error.message
    });
  }
}

// Get detailed candidate information
export async function getCandidateDetails(req, res) {
  try {
    const companyId = req.user.id;
    const { candidateId, applicationId } = req.params;

    console.log('Fetching candidate details:', candidateId, 'for application:', applicationId);

    // Verify access to this candidate through an application
    const accessCheck = await db.select({
      candidatureId: candidatures.id
    })
    .from(candidatures)
    .innerJoin(offres, eq(candidatures.offreId, offres.id))
    .where(and(
      eq(candidatures.id, applicationId),
      eq(candidatures.etudiantId, candidateId),
      eq(offres.entrepriseId, companyId)
    ));

    if (accessCheck.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Accès non autorisé à ce candidat'
      });
    }

    // Get detailed candidate information
    const candidateData = await db.select({
      // User info
      id: users.id,
      nom: users.nom,
      prenom: users.prenom,
      email: users.email,
      telephone: users.telephone,
      dateInscription: users.dateInscription,
      
      // Student info
      matricule: etudiants.matricule,
      niveau: etudiants.niveau,
      filiere: etudiants.filiere,
      competences: etudiants.competences,
      cv: etudiants.cv,
      photoProfile: etudiants.photoProfile,
      dateNaissance: etudiants.dateNaissance
    })
    .from(users)
    .innerJoin(etudiants, eq(users.id, etudiants.id))
    .where(eq(users.id, candidateId));

    if (candidateData.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Candidat non trouvé'
      });
    }

    const candidate = candidateData[0];

    // Get candidate's skills
    const skills = await db.select({
      nom: competences.nom,
      niveau: etudiantCompetences.niveau,
      categorie: competences.categorie,
      dateAjout: etudiantCompetences.dateAjout
    })
    .from(etudiantCompetences)
    .innerJoin(competences, eq(etudiantCompetences.competenceId, competences.id))
    .where(eq(etudiantCompetences.etudiantId, candidateId));

    // Parse additional data from competences JSON
    let additionalData = {};
    try {
      additionalData = candidate.competences ? JSON.parse(candidate.competences) : {};
    } catch (error) {
      console.warn('Failed to parse competences JSON:', error);
    }

    const detailedCandidate = {
      id: candidate.id,
      name: `${candidate.prenom} ${candidate.nom}`,
      email: candidate.email,
      phone: candidate.telephone,
      photo: candidate.photoProfile,
      location: additionalData.location || 'Non spécifié',
      bio: additionalData.bio || '',
      
      // Academic info
      education: {
        niveau: candidate.niveau,
        filiere: candidate.filiere,
        matricule: candidate.matricule
      },
      
      // Professional info
      experience: getExperienceLevel(additionalData),
      jobTitle: additionalData.jobTitle || 'Étudiant',
      
      // Skills and competences
      skills: skills,
      
      // Social links
      socialLinks: additionalData.socialLinks || {},
      
      // Projects and certifications
      projects: additionalData.projects || [],
      certifications: additionalData.certifications || [],
      languages: additionalData.languages || [],
      
      // System info
      dateInscription: candidate.dateInscription,
      dateNaissance: candidate.dateNaissance,
      resumeUrl: candidate.cv
    };

    res.json({
      success: true,
      data: detailedCandidate
    });

  } catch (error) {
    console.error('Error fetching candidate details:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des détails du candidat',
      details: error.message
    });
  }
}

// Helper functions
function calculateCandidateRating(application, skills, competencesData) {
  // Simple rating calculation based on various factors
  let rating = 3.0; // Base rating
  
  // Boost for skills count
  if (skills.length > 5) rating += 0.5;
  if (skills.length > 10) rating += 0.3;
  
  // Boost for advanced level skills
  const advancedSkills = skills.filter(skill => skill.niveau === 'avance' || skill.niveau === 'expert');
  rating += advancedSkills.length * 0.2;
  
  // Boost for portfolio/projects
  if (competencesData.portfolio || (competencesData.projects && competencesData.projects.length > 0)) {
    rating += 0.4;
  }
  
  // Boost for social links (LinkedIn, GitHub)
  if (competencesData.socialLinks?.linkedin) rating += 0.2;
  if (competencesData.socialLinks?.github) rating += 0.2;
  
  // Cap at 5.0
  return Math.min(rating, 5.0);
}

function getExperienceLevel(competencesData) {
  // Try to extract experience from job title or bio
  const jobTitle = competencesData.jobTitle || '';
  const bio = competencesData.bio || '';
  const text = (jobTitle + ' ' + bio).toLowerCase();
  
  if (text.includes('senior') || text.includes('lead') || text.includes('manager')) {
    return '5-8 years';
  } else if (text.includes('junior') || text.includes('débutant')) {
    return '0-2 years';
  } else if (text.includes('intermediate') || text.includes('intermédiaire')) {
    return '2-4 years';
  } else {
    return '2-4 years'; // Default
  }
}
import { db } from '../db/drizzle.js';
import { 
  users, 
  etudiants, 
  entreprises, 
  offres, 
  candidatures, 
  competences,
  etudiantCompetences,
  offreCompetences
} from '../db/schema.js';
import { eq, and, count, desc, sql, gte } from 'drizzle-orm';

// Get comprehensive dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    console.log('Fetching admin dashboard statistics...');

    // Parallel queries for better performance
    const [
      totalUsersResult,
      totalStudentsResult, 
      totalCompaniesResult,
      totalJobsResult,
      activeJobsResult,
      totalApplicationsResult,
      pendingApplicationsResult,
      recentUsersResult
    ] = await Promise.all([
      // Total users
      db.select({ count: count() }).from(users),
      
      // Total students
      db.select({ count: count() }).from(etudiants),
      
      // Total companies
      db.select({ count: count() }).from(entreprises),
      
      // Total jobs
      db.select({ count: count() }).from(offres),
      
      // Active jobs (published and not expired)
      db.select({ count: count() })
        .from(offres)
        .where(eq(offres.statut, 'publiee')),
      
      // Total applications
      db.select({ count: count() }).from(candidatures),
      
      // Pending applications
      db.select({ count: count() })
        .from(candidatures)
        .where(eq(candidatures.statut, 'soumise')),
      
      // Recent users (last 30 days)
      db.select({ count: count() })
        .from(users)
        .where(gte(users.dateInscription, sql`DATE_SUB(NOW(), INTERVAL 30 DAY)`))
    ]);

    // Calculate growth percentages (mock calculation for now)
    const stats = {
      totalUsers: totalUsersResult[0]?.count || 0,
      totalStudents: totalStudentsResult[0]?.count || 0,
      totalCompanies: totalCompaniesResult[0]?.count || 0,
      totalJobs: totalJobsResult[0]?.count || 0,
      activeJobs: activeJobsResult[0]?.count || 0,
      totalApplications: totalApplicationsResult[0]?.count || 0,
      pendingReviews: pendingApplicationsResult[0]?.count || 0,
      recentUsers: recentUsersResult[0]?.count || 0,
      systemHealth: 98.5, // This would come from system monitoring
      
      // Growth calculations (simplified)
      usersGrowth: Math.round((recentUsersResult[0]?.count || 0) / Math.max(totalUsersResult[0]?.count || 1, 1) * 100),
    };

    console.log('Dashboard stats calculated:', stats);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
      details: error.message
    });
  }
}

// Get all users with pagination and filtering
export async function getUsers(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      role = '', 
      status = '' 
    } = req.query;

    console.log('Fetching users with params:', { page, limit, search, role, status });

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build the base query
    let query = db.select({
      id: users.id,
      nom: users.nom,
      prenom: users.prenom,
      email: users.email,
      telephone: users.telephone,
      role: users.role,
      isActive: users.isActive,
      dateInscription: users.dateInscription,
      // Join student data if available
      matricule: etudiants.matricule,
      niveau: etudiants.niveau,
      filiere: etudiants.filiere,
      // Join company data if available
      raisonSociale: entreprises.raisonSociale,
      secteurActivite: entreprises.secteurActivite,
    })
    .from(users)
    .leftJoin(etudiants, eq(users.id, etudiants.id))
    .leftJoin(entreprises, eq(users.id, entreprises.id))
    .limit(parseInt(limit))
    .offset(offset)
    .orderBy(desc(users.dateInscription));

    // Apply filters
    if (role) {
      query = query.where(eq(users.role, role));
    }

    if (search) {
      query = query.where(
        sql`(${users.nom} LIKE ${`%${search}%`} OR ${users.prenom} LIKE ${`%${search}%`} OR ${users.email} LIKE ${`%${search}%`})`
      );
    }

    const usersResult = await query;

    // Get total count for pagination
    let countQuery = db.select({ count: count() }).from(users);
    
    if (role) {
      countQuery = countQuery.where(eq(users.role, role));
    }
    
    if (search) {
      countQuery = countQuery.where(
        sql`(${users.nom} LIKE ${`%${search}%`} OR ${users.prenom} LIKE ${`%${search}%`} OR ${users.email} LIKE ${`%${search}%`})`
      );
    }

    const totalCount = await countQuery;

    // Transform the data for frontend
    const transformedUsers = usersResult.map(user => ({
      id: user.id,
      name: user.role === 'entreprise' ? user.raisonSociale : `${user.prenom} ${user.nom}`,
      email: user.email,
      role: user.role,
      status: user.isActive ? 'Active' : 'Suspended',
      joinDate: user.dateInscription,
      lastLogin: user.dateInscription, // We don't track last login yet
      details: {
        telephone: user.telephone,
        matricule: user.matricule,
        niveau: user.niveau,
        filiere: user.filiere,
        secteurActivite: user.secteurActivite
      }
    }));

    res.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount[0]?.count || 0,
          totalPages: Math.ceil((totalCount[0]?.count || 0) / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des utilisateurs',
      details: error.message
    });
  }
}

// Update user status (activate/suspend)
export async function updateUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    console.log(`Updating user ${userId} status to:`, isActive);

    // Check if user exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, userId));

    if (userExists.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Update user status
    await db.update(users)
      .set({ 
        isActive: isActive ? 1 : 0,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: `Utilisateur ${isActive ? 'activé' : 'suspendu'} avec succès`
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut utilisateur',
      details: error.message
    });
  }
}

// Get job statistics and management data
export async function getJobManagementData(req, res) {
  try {
    console.log('Fetching job management data...');

    // Get job statistics by status
    const jobStats = await db.select({
      statut: offres.statut,
      count: count()
    })
    .from(offres)
    .groupBy(offres.statut);

    // Get recent jobs
    const recentJobs = await db.select({
      id: offres.id,
      titre: offres.titre,
      typeOffre: offres.typeOffre,
      statut: offres.statut,
      datePublication: offres.datePublication,
      dateExpiration: offres.dateExpiration,
      nombrePostes: offres.nombrePostes,
      localisation: offres.localisation,
      entrepriseId: offres.entrepriseId,
      raisonSociale: entreprises.raisonSociale
    })
    .from(offres)
    .leftJoin(entreprises, eq(offres.entrepriseId, entreprises.id))
    .orderBy(desc(offres.datePublication))
    .limit(20);

    // Get application statistics
    const applicationStats = await db.select({
      statut: candidatures.statut,
      count: count()
    })
    .from(candidatures)
    .groupBy(candidatures.statut);

    res.json({
      success: true,
      data: {
        jobStats: jobStats.reduce((acc, stat) => {
          acc[stat.statut] = stat.count;
          return acc;
        }, {}),
        recentJobs,
        applicationStats: applicationStats.reduce((acc, stat) => {
          acc[stat.statut] = stat.count;
          return acc;
        }, {}),
      }
    });

  } catch (error) {
    console.error('Error fetching job management data:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des données de gestion des emplois',
      details: error.message
    });
  }
}

// Get company management data
export async function getCompanyManagementData(req, res) {
  try {
    console.log('Fetching company management data...');

    // Get companies with their job counts
    const companiesData = await db.select({
      id: entreprises.id,
      raisonSociale: entreprises.raisonSociale,
      secteurActivite: entreprises.secteurActivite,
      siteWeb: entreprises.siteWeb,
      isPartenaire: entreprises.isPartenaire,
      datePartenariat: entreprises.datePartenariat,
      // User info
      email: users.email,
      telephone: users.telephone,
      dateInscription: users.dateInscription,
      isActive: users.isActive,
      // Job count
      jobCount: sql`COUNT(${offres.id})`.as('jobCount')
    })
    .from(entreprises)
    .leftJoin(users, eq(entreprises.id, users.id))
    .leftJoin(offres, eq(entreprises.id, offres.entrepriseId))
    .groupBy(entreprises.id, users.email, users.telephone, users.dateInscription, users.isActive)
    .orderBy(desc(users.dateInscription));

    // Get sector statistics
    const sectorStats = await db.select({
      secteur: entreprises.secteurActivite,
      count: count()
    })
    .from(entreprises)
    .where(sql`${entreprises.secteurActivite} IS NOT NULL`)
    .groupBy(entreprises.secteurActivite);

    res.json({
      success: true,
      data: {
        companies: companiesData,
        sectorStats: sectorStats.reduce((acc, stat) => {
          acc[stat.secteur] = stat.count;
          return acc;
        }, {}),
        totalPartners: companiesData.filter(c => c.isPartenaire).length
      }
    });

  } catch (error) {
    console.error('Error fetching company management data:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des données des entreprises',
      details: error.message
    });
  }
}

// Get system alerts and notifications
export async function getSystemAlerts(req, res) {
  try {
    console.log('Fetching system alerts...');

    const alerts = [];

    // Check for recent high application volume
    const recentApplications = await db.select({ count: count() })
      .from(candidatures)
      .where(gte(candidatures.dateCandidature, sql`DATE_SUB(NOW(), INTERVAL 1 DAY)`));

    if (recentApplications[0]?.count > 50) {
      alerts.push({
        id: 'high_applications',
        type: 'warning',
        title: 'Volume élevé de candidatures',
        message: `${recentApplications[0].count} candidatures dans les dernières 24h`,
        timestamp: new Date()
      });
    }

    // Check for pending applications
    const pendingApps = await db.select({ count: count() })
      .from(candidatures)
      .where(eq(candidatures.statut, 'soumise'));

    if (pendingApps[0]?.count > 20) {
      alerts.push({
        id: 'pending_applications',
        type: 'info',
        title: 'Candidatures en attente',
        message: `${pendingApps[0].count} candidatures en attente de traitement`,
        timestamp: new Date()
      });
    }

    // Check for new company registrations
    const newCompanies = await db.select({ count: count() })
      .from(users)
      .where(and(
        eq(users.role, 'entreprise'),
        gte(users.dateInscription, sql`DATE_SUB(NOW(), INTERVAL 7 DAY)`)
      ));

    if (newCompanies[0]?.count > 0) {
      alerts.push({
        id: 'new_companies',
        type: 'success',
        title: 'Nouvelles entreprises',
        message: `${newCompanies[0].count} nouvelles entreprises inscrites cette semaine`,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Error fetching system alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des alertes système',
      details: error.message
    });
  }
}

// Delete user (admin only)
export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    console.log('Admin deleting user:', userId);

    // Check if user exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, userId));

    if (userExists.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Delete user (cascade will handle related records)
    await db.delete(users).where(eq(users.id, userId));

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l\'utilisateur',
      details: error.message
    });
  }
}
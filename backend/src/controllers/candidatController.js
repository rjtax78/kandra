import { db } from '../db/drizzle.js';
import { etudiants, users, etudiantCompetences, competences, candidatures, offres, entreprises } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export async function updateProfilEtudiant(req, res) {
  try {
    const userId = req.user.id;
    const { 
      matricule, 
      niveau, 
      filiere, 
      dateNaissance, 
      competences: competencesIds,
      photoProfile 
    } = req.body;

    // Vérifier que l'utilisateur est un étudiant
    const etudiantExist = await db.select()
      .from(etudiants)
      .where(eq(etudiants.id, userId));
    
    if (etudiantExist.length === 0) {
      return res.status(403).json({ error: 'Profil étudiant non trouvé' });
    }

    // Mettre à jour les informations de l'étudiant
    const updateData = {};
    if (matricule) updateData.matricule = matricule;
    if (niveau) updateData.niveau = niveau;
    if (filiere) updateData.filiere = filiere;
    if (dateNaissance) updateData.dateNaissance = new Date(dateNaissance);
    if (photoProfile) updateData.photoProfile = photoProfile;

    await db.update(etudiants)
      .set(updateData)
      .where(eq(etudiants.id, userId));

    // Mettre à jour les compétences si fournies
    if (competencesIds && Array.isArray(competencesIds)) {
      // Supprimer les anciennes compétences
      await db.delete(etudiantCompetences)
        .where(eq(etudiantCompetences.etudiantId, userId));

      // Ajouter les nouvelles compétences
      for (const competenceData of competencesIds) {
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
      message: 'Profil mis à jour avec succès',
      profil: profilMisAJour
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil' });
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

  return {
    ...etudiant,
    competences: competencesEtudiant,
    statistiques: {
      totalCandidatures: totalCandidatures.length
    }
  };
}

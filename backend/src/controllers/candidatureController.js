import { db } from '../db/drizzle.js';
import { candidatures, etudiants, users, offres, entreprises } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export async function postuler(req, res) {
  try {
    const userId = req.user.id;
    const { offreId, lettreMotivation, cvJoint } = req.body;

    // Validation des champs requis
    if (!offreId) {
      return res.status(400).json({ error: 'ID de l\'offre requis' });
    }

    // Vérifier que l'utilisateur est un étudiant
    const etudiant = await db.select()
      .from(etudiants)
      .where(eq(etudiants.id, userId));
    
    if (etudiant.length === 0) {
      return res.status(403).json({ error: 'Seuls les étudiants peuvent postuler' });
    }

    // Vérifier que l'offre existe et est publiée
    const offre = await db.select()
      .from(offres)
      .where(eq(offres.id, offreId));
    
    if (offre.length === 0) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }

    if (offre[0].statut !== 'publiee') {
      return res.status(400).json({ error: 'Cette offre n\'est pas disponible pour candidature' });
    }

    // Vérifier si l'étudiant a déjà postulé
    const existingCandidature = await db.select()
      .from(candidatures)
      .where(and(
        eq(candidatures.offreId, offreId),
        eq(candidatures.etudiantId, userId)
      ));
    
    if (existingCandidature.length > 0) {
      return res.status(400).json({ error: 'Vous avez déjà postulé à cette offre' });
    }

    // Créer la candidature
    const [newCandidature] = await db.insert(candidatures).values({
      offreId,
      etudiantId: userId,
      lettreMotivation: lettreMotivation || null,
      cvJoint: cvJoint || null,
      statut: 'soumise'
    });

    // Récupérer la candidature créée avec les détails
    const candidatureCreee = await db.select({
      id: candidatures.id,
      offreId: candidatures.offreId,
      etudiantId: candidatures.etudiantId,
      dateCandidature: candidatures.dateCandidature,
      statut: candidatures.statut,
      lettreMotivation: candidatures.lettreMotivation,
      cvJoint: candidatures.cvJoint,
      offreTitre: offres.titre,
      entrepriseNom: entreprises.raisonSociale
    })
    .from(candidatures)
    .leftJoin(offres, eq(candidatures.offreId, offres.id))
    .leftJoin(entreprises, eq(offres.entrepriseId, entreprises.id))
    .where(and(
      eq(candidatures.offreId, offreId),
      eq(candidatures.etudiantId, userId)
    ))
    .orderBy(candidatures.createdAt)
    .limit(1);

    // Transform response to match frontend expectations
    const transformedApplication = {
      _id: candidatureCreee[0].id,
      jobId: candidatureCreee[0].offreId,
      status: 'pending',
      appliedAt: candidatureCreee[0].dateCandidature,
      job: {
        title: candidatureCreee[0].offreTitre,
        company: candidatureCreee[0].entrepriseNom
      }
    };

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: transformedApplication
    });
  } catch (err) {
    console.error('Erreur lors de la candidature:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la soumission de candidature' });
  }
}

export async function listCandidaturesPourOffre(req, res) {
  try {
    const offreId = req.params.id;
    const userId = req.user.id;

    // Vérifier que l'utilisateur est une entreprise et que l'offre lui appartient
    const offre = await db.select({
      id: offres.id,
      entrepriseId: offres.entrepriseId,
      titre: offres.titre
    })
    .from(offres)
    .where(eq(offres.id, offreId));
    
    if (offre.length === 0) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }

    // Vérifier que l'utilisateur connecté est bien l'entreprise propriétaire de l'offre
    if (offre[0].entrepriseId !== userId) {
      return res.status(403).json({ error: 'Accès non autorisé à ces candidatures' });
    }

    // Récupérer les candidatures avec les détails des étudiants
    const candidaturesData = await db.select({
      id: candidatures.id,
      dateCandidature: candidatures.dateCandidature,
      statut: candidatures.statut,
      lettreMotivation: candidatures.lettreMotivation,
      cvJoint: candidatures.cvJoint,
      commentaire: candidatures.commentaire,
      // Détails de l'étudiant
      etudiantId: etudiants.id,
      etudiantMatricule: etudiants.matricule,
      etudiantNiveau: etudiants.niveau,
      etudiantFiliere: etudiants.filiere,
      // Détails de l'utilisateur
      etudiantNom: users.nom,
      etudiantPrenom: users.prenom,
      etudiantEmail: users.email,
      etudiantTelephone: users.telephone
    })
    .from(candidatures)
    .leftJoin(etudiants, eq(candidatures.etudiantId, etudiants.id))
    .leftJoin(users, eq(etudiants.id, users.id))
    .where(eq(candidatures.offreId, offreId))
    .orderBy(candidatures.dateCandidature);

    res.json({
      offre: offre[0],
      candidatures: candidaturesData,
      total: candidaturesData.length
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des candidatures:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des candidatures' });
  }
}

export async function listMesCandidatures(req, res) {
  try {
    const userId = req.user.id;

    // Vérifier que l'utilisateur est un étudiant
    const etudiant = await db.select()
      .from(etudiants)
      .where(eq(etudiants.id, userId));
    
    if (etudiant.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux étudiants' });
    }

    // Récupérer les candidatures de l'étudiant avec les détails des offres
    const mesCandidatures = await db.select({
      id: candidatures.id,
      dateCandidature: candidatures.dateCandidature,
      statut: candidatures.statut,
      lettreMotivation: candidatures.lettreMotivation,
      cvJoint: candidatures.cvJoint,
      commentaire: candidatures.commentaire,
      // Détails de l'offre
      offreId: offres.id,
      offreTitre: offres.titre,
      offreDescription: offres.description,
      offreTypeOffre: offres.typeOffre,
      offreLocalisation: offres.localisation,
      offreSalaire: offres.salaire,
      offreDateExpiration: offres.dateExpiration,
      // Détails de l'entreprise
      entrepriseId: entreprises.id,
      entrepriseNom: entreprises.raisonSociale,
      entrepriseSecteur: entreprises.secteurActivite
    })
    .from(candidatures)
    .leftJoin(offres, eq(candidatures.offreId, offres.id))
    .leftJoin(entreprises, eq(offres.entrepriseId, entreprises.id))
    .where(eq(candidatures.etudiantId, userId))
    .orderBy(candidatures.dateCandidature);

    // Transform data to match frontend expectations
    const applications = mesCandidatures.map(candidature => ({
      _id: candidature.id,
      jobId: candidature.offreId,
      status: candidature.statut === 'soumise' ? 'pending' : 
               candidature.statut === 'acceptee' ? 'accepted' : 
               candidature.statut === 'refusee' ? 'rejected' : candidature.statut,
      coverLetter: candidature.lettreMotivation,
      appliedAt: candidature.dateCandidature,
      createdAt: candidature.dateCandidature,
      job: {
        title: candidature.offreTitre,
        company: candidature.entrepriseNom,
        location: candidature.offreLocalisation,
        type: candidature.offreTypeOffre
      },
      company: candidature.entrepriseNom,
      jobTitle: candidature.offreTitre
    }));

    // Calculate stats
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    res.json({
      applications,
      stats,
      total: applications.length
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des candidatures:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de vos candidatures' });
  }
}

export async function getCandidatureDetails(req, res) {
  try {
    const candidatureId = req.params.id;
    const userId = req.user.id;

    // Récupérer la candidature avec les détails
    const candidatureDetails = await db.select({
      id: candidatures.id,
      dateCandidature: candidatures.dateCandidature,
      statut: candidatures.statut,
      lettreMotivation: candidatures.lettreMotivation,
      cvJoint: candidatures.cvJoint,
      commentaire: candidatures.commentaire,
      // Détails de l'offre
      offreId: offres.id,
      offreTitre: offres.titre,
      offreDescription: offres.description,
      offreTypeOffre: offres.typeOffre,
      offreLocalisation: offres.localisation,
      offreSalaire: offres.salaire,
      // Détails de l'entreprise
      entrepriseNom: entreprises.raisonSociale,
      entrepriseSecteur: entreprises.secteurActivite
    })
    .from(candidatures)
    .leftJoin(offres, eq(candidatures.offreId, offres.id))
    .leftJoin(entreprises, eq(offres.entrepriseId, entreprises.id))
    .where(eq(candidatures.id, candidatureId));
    
    if (candidatureDetails.length === 0) {
      return res.status(404).json({ error: 'Candidature non trouvée' });
    }

    const candidature = candidatureDetails[0];

    // Vérifier que l'utilisateur est soit l'étudiant qui a postulé, soit l'entreprise
    const isOwner = candidature.etudiantId === userId;
    const isCompany = candidature.entrepriseId === userId;
    
    if (!isOwner && !isCompany) {
      return res.status(403).json({ error: 'Accès non autorisé à cette candidature' });
    }

    res.json({
      application: candidature
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des détails:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des détails' });
  }
}

export async function updateStatutCandidature(req, res) {
  try {
    const candidatureId = req.params.id;
    const userId = req.user.id;
    const { statut, commentaire } = req.body;

    // Validation du statut
    const statutsValides = ['soumise', 'en_cours', 'acceptee', 'refusee', 'annulee'];
    if (!statut || !statutsValides.includes(statut)) {
      return res.status(400).json({ 
        error: 'Statut invalide. Statuts autorisés: ' + statutsValides.join(', ') 
      });
    }

    // Récupérer la candidature avec les détails de l'offre
    const candidature = await db.select({
      id: candidatures.id,
      offreId: candidatures.offreId,
      etudiantId: candidatures.etudiantId,
      statut: candidatures.statut,
      entrepriseId: offres.entrepriseId
    })
    .from(candidatures)
    .leftJoin(offres, eq(candidatures.offreId, offres.id))
    .where(eq(candidatures.id, candidatureId));
    
    if (candidature.length === 0) {
      return res.status(404).json({ error: 'Candidature non trouvée' });
    }

    // Vérifier que l'utilisateur connecté est bien l'entreprise propriétaire de l'offre
    if (candidature[0].entrepriseId !== userId) {
      return res.status(403).json({ error: 'Accès non autorisé à cette candidature' });
    }

    // Mettre à jour le statut
    await db.update(candidatures)
      .set({ 
        statut, 
        commentaire: commentaire || null,
        updatedAt: new Date()
      })
      .where(eq(candidatures.id, candidatureId));

    // Récupérer la candidature mise à jour
    const candidatureMiseAJour = await db.select()
      .from(candidatures)
      .where(eq(candidatures.id, candidatureId));

    res.json({
      message: 'Statut de candidature mis à jour avec succès',
      candidature: candidatureMiseAJour[0]
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du statut' });
  }
}

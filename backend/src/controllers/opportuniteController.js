import { db } from '../db/drizzle.js';
import { offres, entreprises, offresStage, offresEmploi, candidatures } from '../db/schema.js';
import { eq, desc, count, and } from 'drizzle-orm';

export async function createOpportunite(req, res) {
  try {
    const userId = req.user.id;
    const {
      titre, typeOffre, description, localisation, salaire,
      dateExpiration, entrepriseId, niveauEtude, competencesRequises,
      // Champs spécifiques aux stages
      duree, estRemunere, montantRemuneration, dateDebut, objectifs,
      // Champs spécifiques aux emplois
      typeContrat, experienceRequise, avantages, estNegociable
    } = req.body;

    // Validation des champs requis
    if (!titre || !typeOffre || !description || !entrepriseId) {
      return res.status(400).json({ 
        error: 'Titre, type d\'offre, description et ID entreprise requis' 
      });
    }

    // Vérifier que l'entreprise existe
    const entreprise = await db.select()
      .from(entreprises)
      .where(eq(entreprises.id, entrepriseId));
    
    if (entreprise.length === 0) {
      return res.status(400).json({ error: 'Entreprise introuvable' });
    }

    // Créer l'offre principale
    const [newOffre] = await db.insert(offres).values({
      entrepriseId,
      titre,
      description,
      typeOffre,
      localisation,
      niveauEtude,
      competencesRequises,
      dateExpiration: dateExpiration ? new Date(dateExpiration) : null,
      salaire,
      statut: 'brouillon' // Par défaut en brouillon
    });

    // Récupérer l'ID de l'offre créée
    const createdOffre = await db.select()
      .from(offres)
      .where(eq(offres.entrepriseId, entrepriseId))
      .orderBy(desc(offres.createdAt))
      .limit(1);
    
    const offreId = createdOffre[0].id;

    // Ajouter les détails spécifiques selon le type
    if (typeOffre === 'stage') {
      await db.insert(offresStage).values({
        id: offreId,
        duree,
        estRemunere: estRemunere ? 1 : 0,
        montantRemuneration: montantRemuneration || null,
        dateDebut: dateDebut ? new Date(dateDebut) : null,
        objectifs
      });
    } else if (typeOffre === 'emploi') {
      if (!typeContrat) {
        return res.status(400).json({ error: 'Type de contrat requis pour les emplois' });
      }
      await db.insert(offresEmploi).values({
        id: offreId,
        typeContrat,
        experienceRequise,
        avantages,
        estNegociable: estNegociable ? 1 : 0
      });
    }

    res.status(201).json({ 
      message: 'Offre créée avec succès',
      id: offreId,
      offre: createdOffre[0]
    });
  } catch (err) {
    console.error('Create offre error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'offre' });
  }
}

export async function listOpportunites(req, res) {
  try {
    const { typeOffre, statut, limit = 100 } = req.query;
    
    // Construire la requête avec les filtres
    let query = db.select({
      id: offres.id,
      titre: offres.titre,
      description: offres.description,
      typeOffre: offres.typeOffre,
      localisation: offres.localisation,
      salaire: offres.salaire,
      datePublication: offres.datePublication,
      dateExpiration: offres.dateExpiration,
      statut: offres.statut,
      nombrePostes: offres.nombrePostes,
      entrepriseNom: entreprises.raisonSociale,
      entrepriseId: entreprises.id
    })
    .from(offres)
    .leftJoin(entreprises, eq(offres.entrepriseId, entreprises.id))
    .orderBy(desc(offres.datePublication))
    .limit(parseInt(limit));

    // Appliquer les filtres si spécifiés
    if (typeOffre) {
      query = query.where(eq(offres.typeOffre, typeOffre));
    }
    if (statut) {
      query = query.where(eq(offres.statut, statut));
    } else {
      // Par défaut, ne montrer que les offres publiées
      query = query.where(eq(offres.statut, 'publiee'));
    }

    const result = await query;
    res.json(result);
  } catch (err) {
    console.error('List offres error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des offres' });
  }
}

export async function getOpportunite(req, res) {
  try {
    const id = req.params.id;
    
    // Récupérer l'offre avec les détails de l'entreprise
    const offre = await db.select({
      id: offres.id,
      titre: offres.titre,
      description: offres.description,
      typeOffre: offres.typeOffre,
      localisation: offres.localisation,
      niveauEtude: offres.niveauEtude,
      competencesRequises: offres.competencesRequises,
      salaire: offres.salaire,
      datePublication: offres.datePublication,
      dateExpiration: offres.dateExpiration,
      statut: offres.statut,
      nombrePostes: offres.nombrePostes,
      entrepriseId: entreprises.id,
      entrepriseNom: entreprises.raisonSociale,
      entrepriseSecteur: entreprises.secteurActivite,
      entrepriseDescription: entreprises.description,
      entrepriseSiteWeb: entreprises.siteWeb
    })
    .from(offres)
    .leftJoin(entreprises, eq(offres.entrepriseId, entreprises.id))
    .where(eq(offres.id, id));
    
    if (offre.length === 0) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }

    const result = offre[0];

    // Récupérer les détails spécifiques selon le type
    if (result.typeOffre === 'stage') {
      const stageDetails = await db.select()
        .from(offresStage)
        .where(eq(offresStage.id, id));
      if (stageDetails.length > 0) {
        result.stageDetails = stageDetails[0];
      }
    } else if (result.typeOffre === 'emploi') {
      const emploiDetails = await db.select()
        .from(offresEmploi)
        .where(eq(offresEmploi.id, id));
      if (emploiDetails.length > 0) {
        result.emploiDetails = emploiDetails[0];
      }
    }

    res.json(result);
  } catch (err) {
    console.error('Get offre error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'offre' });
  }
}

// Get company's job offers
export async function getCompanyOffers(req, res) {
  try {
    const userId = req.user.id;
    const { statut, typeOffre, limit = 50, offset = 0 } = req.query;

    // Verify user is a company
    const company = await db.select()
      .from(entreprises)
      .where(eq(entreprises.id, userId));
    
    if (company.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux entreprises' });
    }

    let query = db.select({
      id: offres.id,
      titre: offres.titre,
      description: offres.description,
      typeOffre: offres.typeOffre,
      localisation: offres.localisation,
      salaire: offres.salaire,
      datePublication: offres.datePublication,
      dateExpiration: offres.dateExpiration,
      statut: offres.statut,
      nombrePostes: offres.nombrePostes,
      niveauEtude: offres.niveauEtude,
      competencesRequises: offres.competencesRequises,
      createdAt: offres.createdAt,
      updatedAt: offres.updatedAt
    })
    .from(offres)
    .where(eq(offres.entrepriseId, userId))
    .orderBy(desc(offres.createdAt))
    .limit(parseInt(limit))
    .offset(parseInt(offset));

    // Apply filters
    if (statut) {
      query = query.where(and(eq(offres.entrepriseId, userId), eq(offres.statut, statut)));
    }
    if (typeOffre) {
      query = query.where(and(eq(offres.entrepriseId, userId), eq(offres.typeOffre, typeOffre)));
    }

    const offers = await query;

    // Get application counts for each offer
    const offersWithApplications = await Promise.all(
      offers.map(async (offer) => {
        const applicationCount = await db.select({ count: count() })
          .from(candidatures)
          .where(eq(candidatures.offreId, offer.id));
        
        return {
          ...offer,
          applicants: applicationCount[0]?.count || 0
        };
      })
    );

    res.json({
      offers: offersWithApplications,
      total: offersWithApplications.length
    });
  } catch (err) {
    console.error('Get company offers error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des offres' });
  }
}

// Update job offer
export async function updateOpportunite(req, res) {
  try {
    const userId = req.user.id;
    const offreId = req.params.id;
    const {
      titre, typeOffre, description, localisation, salaire,
      dateExpiration, niveauEtude, competencesRequises, statut, nombrePostes,
      // Stage-specific fields
      duree, estRemunere, montantRemuneration, dateDebut, objectifs,
      // Job-specific fields
      typeContrat, experienceRequise, avantages, estNegociable
    } = req.body;

    // Check if offer exists and belongs to the company
    const existingOffer = await db.select()
      .from(offres)
      .where(and(eq(offres.id, offreId), eq(offres.entrepriseId, userId)));
    
    if (existingOffer.length === 0) {
      return res.status(404).json({ error: 'Offre non trouvée ou accès non autorisé' });
    }

    // Update main offer data
    const updateData = {};
    if (titre) updateData.titre = titre;
    if (description) updateData.description = description;
    if (localisation) updateData.localisation = localisation;
    if (salaire) updateData.salaire = salaire;
    if (dateExpiration) updateData.dateExpiration = new Date(dateExpiration);
    if (niveauEtude) updateData.niveauEtude = niveauEtude;
    if (competencesRequises) updateData.competencesRequises = competencesRequises;
    if (statut) updateData.statut = statut;
    if (nombrePostes) updateData.nombrePostes = nombrePostes;

    await db.update(offres)
      .set(updateData)
      .where(eq(offres.id, offreId));

    // Update type-specific details if provided
    if (existingOffer[0].typeOffre === 'stage' && (duree || estRemunere !== undefined || montantRemuneration || dateDebut || objectifs)) {
      const stageUpdateData = {};
      if (duree) stageUpdateData.duree = duree;
      if (estRemunere !== undefined) stageUpdateData.estRemunere = estRemunere ? 1 : 0;
      if (montantRemuneration) stageUpdateData.montantRemuneration = montantRemuneration;
      if (dateDebut) stageUpdateData.dateDebut = new Date(dateDebut);
      if (objectifs) stageUpdateData.objectifs = objectifs;

      await db.update(offresStage)
        .set(stageUpdateData)
        .where(eq(offresStage.id, offreId));
    }

    if (existingOffer[0].typeOffre === 'emploi' && (typeContrat || experienceRequise || avantages || estNegociable !== undefined)) {
      const emploiUpdateData = {};
      if (typeContrat) emploiUpdateData.typeContrat = typeContrat;
      if (experienceRequise) emploiUpdateData.experienceRequise = experienceRequise;
      if (avantages) emploiUpdateData.avantages = avantages;
      if (estNegociable !== undefined) emploiUpdateData.estNegociable = estNegociable ? 1 : 0;

      await db.update(offresEmploi)
        .set(emploiUpdateData)
        .where(eq(offresEmploi.id, offreId));
    }

    // Get updated offer
    const updatedOffer = await db.select()
      .from(offres)
      .where(eq(offres.id, offreId));

    res.json({
      message: 'Offre mise à jour avec succès',
      offer: updatedOffer[0]
    });
  } catch (err) {
    console.error('Update offer error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'offre' });
  }
}

// Delete job offer
export async function deleteOpportunite(req, res) {
  try {
    const userId = req.user.id;
    const offreId = req.params.id;

    // Check if offer exists and belongs to the company
    const existingOffer = await db.select()
      .from(offres)
      .where(and(eq(offres.id, offreId), eq(offres.entrepriseId, userId)));
    
    if (existingOffer.length === 0) {
      return res.status(404).json({ error: 'Offre non trouvée ou accès non autorisé' });
    }

    // Check if there are any applications
    const applicationCount = await db.select({ count: count() })
      .from(candidatures)
      .where(eq(candidatures.offreId, offreId));

    if (applicationCount[0]?.count > 0) {
      // Archive instead of delete if there are applications
      await db.update(offres)
        .set({ statut: 'archivee' })
        .where(eq(offres.id, offreId));
      
      res.json({ message: 'Offre archivée avec succès (des candidatures existent)' });
    } else {
      // Delete the offer (cascading will handle related records)
      await db.delete(offres)
        .where(eq(offres.id, offreId));
      
      res.json({ message: 'Offre supprimée avec succès' });
    }
  } catch (err) {
    console.error('Delete offer error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'offre' });
  }
}

// Get company dashboard statistics
export async function getCompanyStats(req, res) {
  try {
    const userId = req.user.id;

    // Verify user is a company
    const company = await db.select()
      .from(entreprises)
      .where(eq(entreprises.id, userId));
    
    if (company.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux entreprises' });
    }

    // Get offer statistics
    const allOffers = await db.select({
      statut: offres.statut,
      id: offres.id
    })
    .from(offres)
    .where(eq(offres.entrepriseId, userId));

    const stats = {
      totalOffers: allOffers.length,
      activeOffers: allOffers.filter(o => o.statut === 'publiee').length,
      draftOffers: allOffers.filter(o => o.statut === 'brouillon').length,
      archivedOffers: allOffers.filter(o => o.statut === 'archivee').length,
      totalApplications: 0,
      avgApplicationsPerOffer: 0
    };

    // Get application statistics
    if (allOffers.length > 0) {
      const applicationStats = await db.select({ count: count() })
        .from(candidatures)
        .leftJoin(offres, eq(candidatures.offreId, offres.id))
        .where(eq(offres.entrepriseId, userId));
      
      stats.totalApplications = applicationStats[0]?.count || 0;
      stats.avgApplicationsPerOffer = stats.totalOffers > 0 
        ? Math.round(stats.totalApplications / stats.totalOffers) 
        : 0;
    }

    res.json(stats);
  } catch (err) {
    console.error('Get company stats error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
}

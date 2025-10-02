import { db } from '../db/drizzle.js';
import { offres, entreprises, offresStage, offresEmploi } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

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

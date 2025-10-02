import { db } from '../db/drizzle.js';
import { entreprises, users, offres, candidatures, etudiants } from '../db/schema.js';
import { eq, count, desc } from 'drizzle-orm';

export async function updateProfilEntreprise(req, res) {
  try {
    const userId = req.user.id;
    const { 
      raisonSociale,
      secteurActivite,
      description,
      adresse,
      siteWeb,
      logo
    } = req.body;

    // Vérifier que l'utilisateur est une entreprise
    const entrepriseExist = await db.select()
      .from(entreprises)
      .where(eq(entreprises.id, userId));
    
    if (entrepriseExist.length === 0) {
      return res.status(403).json({ error: 'Profil entreprise non trouvé' });
    }

    // Mettre à jour les informations de l'entreprise
    const updateData = {};
    if (raisonSociale) updateData.raisonSociale = raisonSociale;
    if (secteurActivite) updateData.secteurActivite = secteurActivite;
    if (description) updateData.description = description;
    if (adresse) updateData.adresse = adresse;
    if (siteWeb) updateData.siteWeb = siteWeb;
    if (logo) updateData.logo = logo;

    await db.update(entreprises)
      .set(updateData)
      .where(eq(entreprises.id, userId));

    // Récupérer le profil mis à jour
    const profilMisAJour = await getProfilEntrepriseComplet(userId);

    res.json({
      message: 'Profil entreprise mis à jour avec succès',
      profil: profilMisAJour
    });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du profil entreprise:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil' });
  }
}

export async function getMonProfilEntreprise(req, res) {
  try {
    const userId = req.user.id;
    
    const profil = await getProfilEntrepriseComplet(userId);
    
    if (!profil) {
      return res.status(404).json({ error: 'Profil entreprise non trouvé' });
    }

    res.json(profil);
  } catch (err) {
    console.error('Erreur lors de la récupération du profil entreprise:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil' });
  }
}

export async function listEntreprises(req, res) {
  try {
    const { secteur, isPartenaire, limit = 50 } = req.query;

    let query = db.select({
      id: entreprises.id,
      raisonSociale: entreprises.raisonSociale,
      secteurActivite: entreprises.secteurActivite,
      description: entreprises.description,
      adresse: entreprises.adresse,
      siteWeb: entreprises.siteWeb,
      logo: entreprises.logo,
      isPartenaire: entreprises.isPartenaire,
      datePartenariat: entreprises.datePartenariat,
      // Informations utilisateur
      nom: users.nom,
      prenom: users.prenom,
      email: users.email,
      telephone: users.telephone
    })
    .from(entreprises)
    .leftJoin(users, eq(entreprises.id, users.id))
    .limit(parseInt(limit))
    .orderBy(entreprises.raisonSociale);

    // Appliquer les filtres
    if (secteur) {
      query = query.where(eq(entreprises.secteurActivite, secteur));
    }
    if (isPartenaire !== undefined) {
      query = query.where(eq(entreprises.isPartenaire, isPartenaire === 'true' ? 1 : 0));
    }

    const entreprisesList = await query;

    res.json({
      entreprises: entreprisesList,
      total: entreprisesList.length
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des entreprises:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des entreprises' });
  }
}

export async function getEntreprise(req, res) {
  try {
    const entrepriseId = req.params.id;
    
    const profil = await getProfilEntrepriseComplet(entrepriseId);
    
    if (!profil) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    res.json(profil);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'entreprise:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'entreprise' });
  }
}

export async function getStatistiquesEntreprise(req, res) {
  try {
    const userId = req.user.id;

    // Vérifier que l'utilisateur est une entreprise
    const entreprise = await db.select()
      .from(entreprises)
      .where(eq(entreprises.id, userId));
    
    if (entreprise.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux entreprises' });
    }

    // Compter les offres par statut
    const offresStats = await db.select({
      statut: offres.statut,
      count: count()
    })
    .from(offres)
    .where(eq(offres.entrepriseId, userId))
    .groupBy(offres.statut);

    // Compter le total de candidatures reçues
    const totalCandidatures = await db.select({
      count: count()
    })
    .from(candidatures)
    .leftJoin(offres, eq(candidatures.offreId, offres.id))
    .where(eq(offres.entrepriseId, userId));

    const stats = {
      totalOffres: offresStats.reduce((acc, curr) => acc + curr.count, 0),
      offresParStatut: offresStats.reduce((acc, curr) => {
        acc[curr.statut] = curr.count;
        return acc;
      }, {}),
      totalCandidatures: totalCandidatures[0]?.count || 0,
      isPartenaire: entreprise[0].isPartenaire === 1
    };

    res.json(stats);
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques entreprise:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
}

export async function getMesOffres(req, res) {
  try {
    const userId = req.user.id;
    const { statut, typeOffre, limit = 20 } = req.query;

    // Vérifier que l'utilisateur est une entreprise
    const entreprise = await db.select()
      .from(entreprises)
      .where(eq(entreprises.id, userId));
    
    if (entreprise.length === 0) {
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
      competencesRequises: offres.competencesRequises
    })
    .from(offres)
    .where(eq(offres.entrepriseId, userId))
    .orderBy(desc(offres.datePublication))
    .limit(parseInt(limit));

    // Appliquer les filtres
    if (statut) {
      query = query.where(eq(offres.statut, statut));
    }
    if (typeOffre) {
      query = query.where(eq(offres.typeOffre, typeOffre));
    }

    const mesOffres = await query;

    // Ajouter le nombre de candidatures pour chaque offre
    const offresAvecCandidatures = await Promise.all(
      mesOffres.map(async (offre) => {
        const candidaturesCount = await db.select({
          count: count()
        })
        .from(candidatures)
        .where(eq(candidatures.offreId, offre.id));

        return {
          ...offre,
          nombreCandidatures: candidaturesCount[0]?.count || 0
        };
      })
    );

    res.json({
      offres: offresAvecCandidatures,
      total: offresAvecCandidatures.length
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des offres:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de vos offres' });
  }
}

// Fonction utilitaire pour récupérer un profil entreprise complet
async function getProfilEntrepriseComplet(userId) {
  // Récupérer les informations de base
  const entrepriseData = await db.select({
    id: entreprises.id,
    raisonSociale: entreprises.raisonSociale,
    secteurActivite: entreprises.secteurActivite,
    description: entreprises.description,
    adresse: entreprises.adresse,
    siteWeb: entreprises.siteWeb,
    logo: entreprises.logo,
    isPartenaire: entreprises.isPartenaire,
    datePartenariat: entreprises.datePartenariat,
    // Informations utilisateur
    nom: users.nom,
    prenom: users.prenom,
    email: users.email,
    telephone: users.telephone,
    dateInscription: users.dateInscription,
    role: users.role,
    isActive: users.isActive
  })
  .from(entreprises)
  .leftJoin(users, eq(entreprises.id, users.id))
  .where(eq(entreprises.id, userId));

  if (entrepriseData.length === 0) {
    return null;
  }

  const entreprise = entrepriseData[0];

  // Récupérer les statistiques d'offres
  const totalOffres = await db.select({
    count: count()
  })
  .from(offres)
  .where(eq(offres.entrepriseId, userId));

  // Récupérer les statistiques de candidatures
  const totalCandidatures = await db.select({
    count: count()
  })
  .from(candidatures)
  .leftJoin(offres, eq(candidatures.offreId, offres.id))
  .where(eq(offres.entrepriseId, userId));

  return {
    ...entreprise,
    statistiques: {
      totalOffres: totalOffres[0]?.count || 0,
      totalCandidatures: totalCandidatures[0]?.count || 0
    }
  };
}

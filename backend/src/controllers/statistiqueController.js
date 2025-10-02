import { db } from '../db/drizzle.js';
import { users, etudiants, entreprises, offres, candidatures, competences } from '../db/schema.js';
import { eq, count, desc, gte, lte, and } from 'drizzle-orm';

export async function getStatistiquesGlobales(req, res) {
  try {
    const userId = req.user.id;
    
    // Vérifier que l'utilisateur est admin
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0 || user[0].role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    // Statistiques des utilisateurs
    const totalUsers = await db.select({ count: count() }).from(users);
    const totalEtudiants = await db.select({ count: count() }).from(etudiants);
    const totalEntreprises = await db.select({ count: count() }).from(entreprises);
    
    // Statistiques des entreprises partenaires
    const entreprisesPartenaires = await db.select({ count: count() })
      .from(entreprises)
      .where(eq(entreprises.isPartenaire, 1));

    // Statistiques des offres
    const totalOffres = await db.select({ count: count() }).from(offres);
    const offresPubliees = await db.select({ count: count() })
      .from(offres)
      .where(eq(offres.statut, 'publiee'));
    const offresStages = await db.select({ count: count() })
      .from(offres)
      .where(eq(offres.typeOffre, 'stage'));
    const offresEmplois = await db.select({ count: count() })
      .from(offres)
      .where(eq(offres.typeOffre, 'emploi'));

    // Statistiques des candidatures
    const totalCandidatures = await db.select({ count: count() }).from(candidatures);
    const candidaturesAcceptees = await db.select({ count: count() })
      .from(candidatures)
      .where(eq(candidatures.statut, 'acceptee'));
    
    // Statistiques des compétences
    const totalCompetences = await db.select({ count: count() }).from(competences);

    const stats = {
      utilisateurs: {
        total: totalUsers[0].count,
        etudiants: totalEtudiants[0].count,
        entreprises: totalEntreprises[0].count,
        entreprisesPartenaires: entreprisesPartenaires[0].count
      },
      offres: {
        total: totalOffres[0].count,
        publiees: offresPubliees[0].count,
        stages: offresStages[0].count,
        emplois: offresEmplois[0].count
      },
      candidatures: {
        total: totalCandidatures[0].count,
        acceptees: candidaturesAcceptees[0].count,
        tauxAcceptation: totalCandidatures[0].count > 0 
          ? ((candidaturesAcceptees[0].count / totalCandidatures[0].count) * 100).toFixed(2)
          : 0
      },
      competences: {
        total: totalCompetences[0].count
      }
    };

    res.json(stats);
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
}

export async function getStatistiquesParPeriode(req, res) {
  try {
    const userId = req.user.id;
    const { dateDebut, dateFin, type = 'toutes' } = req.query;
    
    // Vérifier que l'utilisateur est admin
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0 || user[0].role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    if (!dateDebut || !dateFin) {
      return res.status(400).json({ error: 'Date de début et date de fin requises' });
    }

    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    let stats = {};

    if (type === 'inscriptions' || type === 'toutes') {
      // Inscriptions par période
      const inscriptions = await db.select({ count: count() })
        .from(users)
        .where(and(
          gte(users.dateInscription, startDate),
          lte(users.dateInscription, endDate)
        ));
      
      stats.inscriptions = inscriptions[0].count;
    }

    if (type === 'offres' || type === 'toutes') {
      // Offres publiées par période
      const offresParPeriode = await db.select({ count: count() })
        .from(offres)
        .where(and(
          gte(offres.datePublication, startDate),
          lte(offres.datePublication, endDate)
        ));
      
      stats.offresPubliees = offresParPeriode[0].count;
    }

    if (type === 'candidatures' || type === 'toutes') {
      // Candidatures par période
      const candidaturesParPeriode = await db.select({ count: count() })
        .from(candidatures)
        .where(and(
          gte(candidatures.dateCandidature, startDate),
          lte(candidatures.dateCandidature, endDate)
        ));
      
      stats.candidatures = candidaturesParPeriode[0].count;
    }

    res.json({
      periode: {
        debut: dateDebut,
        fin: dateFin
      },
      statistiques: stats
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques par période:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
}

export async function getStatistiquesEntreprises(req, res) {
  try {
    const userId = req.user.id;
    
    // Vérifier que l'utilisateur est admin
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0 || user[0].role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    // Top entreprises par nombre d'offres
    const topEntreprisesOffres = await db.select({
      entrepriseId: entreprises.id,
      raisonSociale: entreprises.raisonSociale,
      secteurActivite: entreprises.secteurActivite,
      nombreOffres: count(offres.id)
    })
    .from(entreprises)
    .leftJoin(offres, eq(entreprises.id, offres.entrepriseId))
    .groupBy(entreprises.id)
    .orderBy(desc(count(offres.id)))
    .limit(10);

    // Secteurs les plus actifs
    const secteursActifs = await db.select({
      secteur: entreprises.secteurActivite,
      nombreEntreprises: count()
    })
    .from(entreprises)
    .groupBy(entreprises.secteurActivite)
    .orderBy(desc(count()))
    .limit(10);

    res.json({
      topEntreprisesParOffres: topEntreprisesOffres,
      secteursLesPlusActifs: secteursActifs
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques entreprises:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques entreprises' });
  }
}

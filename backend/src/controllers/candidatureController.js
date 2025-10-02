import pool from '../db.js';

export async function postuler(req, res) {
  try {
    const candidatUtilisateurId = req.user.id;
    const { OpportuniteID, CVID, Motivation } = req.body;

    const [candRows] = await pool.query('SELECT * FROM Candidat WHERE UtilisateurID = ?', [candidatUtilisateurId]);
    let candidatId;
    if (candRows.length) candidatId = candRows[0].ID;
    else {
      const [r] = await pool.query('INSERT INTO Candidat (UtilisateurID, Nom, Prenom, ProfilComplet) VALUES (?, ?, ?, ?)', [candidatUtilisateurId, '', '', false]);
      candidatId = r.insertId;
    }

    const [resInsert] = await pool.query(
      'INSERT INTO Candidature (CVID, OpportuniteID, CandidatID, Motivation) VALUES (?, ?, ?, ?)',
      [CVID || null, OpportuniteID, candidatId, Motivation || null]
    );
    res.status(201).json({ id: resInsert.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listCandidaturesPourOpportunite(req, res) {
  try {
    const opportuniteId = req.params.id;
    const [rows] = await pool.query(
      `SELECT c.*, cand.Nom, cand.Prenom, cv.NomFichier
       FROM Candidature c
       LEFT JOIN Candidat cand ON c.CandidatID = cand.ID
       LEFT JOIN CV cv ON c.CVID = cv.ID
       WHERE c.OpportuniteID = ?`, [opportuniteId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

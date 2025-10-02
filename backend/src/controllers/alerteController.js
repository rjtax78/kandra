import pool from '../db.js';

export async function createAlerte(req, res) {
  try {
    const { OpportuniteID, Contenu, Type } = req.body;
    const candidatId = req.user.id;
    const [result] = await pool.query(
      `INSERT INTO AlerteRecommendation (OpportuniteID, CandidatID, Contenu, Type)
       VALUES (?, ?, ?, ?)`,
      [OpportuniteID, candidatId, Contenu, Type]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listAlertes(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM AlerteRecommendation ORDER BY DateCreation DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

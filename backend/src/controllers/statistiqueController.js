import pool from '../db.js';

export async function createStatistique(req, res) {
  try {
    const { TypeStatistique, Valeur, PeriodeDebut, PeriodeFin, Filtre } = req.body;
    const administrateurId = req.user.id;
    const [result] = await pool.query(
      `INSERT INTO Statistique (AdministrateurID, TypeStatistique, Valeur, DateGeneration, PeriodeDebut, PeriodeFin, Filtre)
       VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
      [administrateurId, TypeStatistique, Valeur, PeriodeDebut, PeriodeFin, Filtre]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listStatistiques(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Statistique ORDER BY DateGeneration DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

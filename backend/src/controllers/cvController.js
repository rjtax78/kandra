import pool from '../db.js';

export async function uploadCV(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier manquant' });
    const { filename, path } = req.file;
    const [result] = await pool.query(
      'INSERT INTO CV (NomFichier, UrlFichier) VALUES (?, ?)',
      [filename, path]
    );
    res.status(201).json({ id: result.insertId, filename, path });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listCVs(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM CV ORDER BY DateTelechargement DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

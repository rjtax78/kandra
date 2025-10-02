import pool from '../db.js';

export async function createRessource(req, res) {
  try {
    const { Titre, UrlContenu, TypeRessource, Auteur } = req.body;
    const administrateurId = req.user.id;
    const [result] = await pool.query(
      `INSERT INTO Ressource (AdministrateurID, Titre, UrlContenu, TypeRessource, Auteur, DatePublication)
       VALUES (?, ?, ?, ?, ?, CURDATE())`,
      [administrateurId, Titre, UrlContenu, TypeRessource, Auteur]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listRessources(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Ressource ORDER BY DatePublication DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

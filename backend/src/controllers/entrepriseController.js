import pool from '../db.js';

export async function createEntreprise(req, res) {
  try {
    const { EntrepriseNom, SecteurActivite, Description, AdresseSiege, Contact, EmailContact, LogoUrl } = req.body;
    const utilisateurId = req.user.id;
    const [result] = await pool.query(
      `INSERT INTO Entreprise (UtilisateurID, EntrepriseNom, SecteurActivite, Description, AdresseSiege, Contact, EmailContact, LogoUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [utilisateurId, EntrepriseNom, SecteurActivite, Description, AdresseSiege, Contact, EmailContact, LogoUrl]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listEntreprises(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Entreprise ORDER BY EntrepriseNom');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function getEntreprise(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Entreprise WHERE ID = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Entreprise non trouvée' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

import pool from '../db.js';

export async function createCandidat(req, res) {
  try {
    const { Nom, Prenom, Adresse, TelephoneContact, NiveauEtude, Specialisation, PreferenceRecherche } = req.body;
    const utilisateurId = req.user.id;
    const [result] = await pool.query(
      `INSERT INTO Candidat (UtilisateurID, Nom, Prenom, Adresse, TelephoneContact, NiveauEtude, Specialisation, PreferenceRecherche, ProfilComplet)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [utilisateurId, Nom, Prenom, Adresse, TelephoneContact, NiveauEtude, Specialisation, PreferenceRecherche, true]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listCandidats(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Candidat ORDER BY Nom');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function getCandidat(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Candidat WHERE ID = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Candidat non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

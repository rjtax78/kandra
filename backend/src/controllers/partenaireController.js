import pool from '../db.js';

export async function createPartenaire(req, res) {
  try {
    const { OpportuniteID, NomPartenaire, TypeOrganisation, PersonneContact, TelephoneContact } = req.body;
    const utilisateurId = req.user.id;
    const [result] = await pool.query(
      `INSERT INTO Partenaire (OpportuniteID, UtilisateurID, NomPartenaire, TypeOrganisation, PersonneContact, TelephoneContact)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [OpportuniteID, utilisateurId, NomPartenaire, TypeOrganisation, PersonneContact, TelephoneContact]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export async function listPartenaires(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Partenaire');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

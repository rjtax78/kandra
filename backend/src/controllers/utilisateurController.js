import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Inscription
export async function register(req, res) {
  try {
    const { Email, MotDePasse } = req.body;

    // Vérif si déjà existant
    const [userExist] = await pool.query('SELECT * FROM Utilisateur WHERE Email = ?', [Email]);
    if (userExist.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hasher mot de passe
    const hashedPassword = await bcrypt.hash(MotDePasse, 10);

    // Sauvegarder
    const [result] = await pool.query(
      `INSERT INTO Utilisateur (Email, MotDePasse, DateInscription, StatutCompte)
       VALUES (?, ?, NOW(), ?)`,
      [Email, hashedPassword, 'actif']
    );

    res.status(201).json({ message: 'Utilisateur créé', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ✅ Connexion
export async function login(req, res) {
  try {
    const { Email, MotDePasse } = req.body;

    // Vérif utilisateur
    const [rows] = await pool.query('SELECT * FROM Utilisateur WHERE Email = ?', [Email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = rows[0];

    // Vérif mot de passe
    const validPass = await bcrypt.compare(MotDePasse, user.MotDePasse);
    if (!validPass) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer JWT
    const token = jwt.sign({ id: user.ID, email: user.Email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { id: user.ID, email: user.Email } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ✅ Récupérer mes infos
export async function me(req, res) {
  try {
    const [rows] = await pool.query('SELECT ID, Email, DateInscription, StatutCompte FROM Utilisateur WHERE ID = ?', [
      req.user.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

import { db } from '../db/drizzle.js';
import { users, etudiants, entreprises } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'kandra_spray_info_secret_key_2025';

export async function register(req, res) {
  try {
    const { email, password, nom, prenom, role, telephone, matricule, raisonSociale } = req.body;
    // Validation des champs requis
    if (!email || !password || !nom || !prenom || !role) {
      return res.status(400).json({ 
        error: 'Email, mot de passe, nom, prénom et rôle sont requis' 
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur principal
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      nom,
      prenom,
      telephone,
      role
    });

    // Récupérer l'utilisateur créé avec son ID
    const createdUser = await db.select({
      id: users.id,
      email: users.email,
      nom: users.nom,
      prenom: users.prenom,
      role: users.role
    }).from(users).where(eq(users.email, email));

    const userId = createdUser[0].id;

    // Créer le profil spécifique selon le rôle
    if (role === 'etudiant') {
      if (!matricule) {
        return res.status(400).json({ error: 'Matricule requis pour les étudiants' });
      }
      await db.insert(etudiants).values({
        id: userId,
        matricule
      });
    } else if (role === 'entreprise') {
      if (!raisonSociale) {
        return res.status(400).json({ error: 'Raison sociale requise pour les entreprises' });
      }
      await db.insert(entreprises).values({
        id: userId,
        raisonSociale
      });
    }

    // Create JWT token for immediate login
    const token = jwt.sign(
      { 
        id: userId, 
        email: createdUser[0].email, 
        role: createdUser[0].role 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Inscription réussie',
      token,
      user: {
        id: userId,
        email: createdUser[0].email,
        nom: createdUser[0].nom,
        prenom: createdUser[0].prenom,
        role: createdUser[0].role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Rechercher l'utilisateur
    const userResult = await db.select().from(users).where(eq(users.email, email));
    
    if (userResult.length === 0) {
      return res.status(400).json({ error: 'Utilisateur introuvable' });
    }

    const user = userResult[0];

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({ error: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Connexion réussie',
      token, 
      user: { 
        id: user.id, 
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
}

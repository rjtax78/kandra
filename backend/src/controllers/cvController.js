import { db } from '../db/drizzle.js';
import { etudiants, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';

export async function uploadCV(req, res) {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Fichier CV manquant' });
    }

    // Vérifier que l'utilisateur est un étudiant
    const etudiant = await db.select()
      .from(etudiants)
      .where(eq(etudiants.id, userId));
    
    if (etudiant.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux étudiants' });
    }

    const { filename, path: filePath, mimetype, size } = req.file;
    
    // Valider le type de fichier (PDF uniquement)
    if (mimetype !== 'application/pdf') {
      // Supprimer le fichier uploadé s'il n'est pas valide
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Seuls les fichiers PDF sont acceptés' });
    }

    // Valider la taille (max 5MB)
    if (size > 5 * 1024 * 1024) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Le fichier ne peut pas dépasser 5MB' });
    }

    // Supprimer l'ancien CV s'il existe
    const ancienCV = etudiant[0].cv;
    if (ancienCV) {
      try {
        const ancienCheminCV = path.join('uploads', ancienCV);
        if (fs.existsSync(ancienCheminCV)) {
          fs.unlinkSync(ancienCheminCV);
        }
      } catch (error) {
        console.warn('Impossible de supprimer l\'ancien CV:', error.message);
      }
    }

    // Mettre à jour le profil étudiant avec le nouveau CV
    await db.update(etudiants)
      .set({ cv: filename })
      .where(eq(etudiants.id, userId));

    res.status(201).json({ 
      message: 'CV uploadé avec succès',
      cv: {
        filename,
        path: `/uploads/${filename}`,
        mimetype,
        size
      }
    });
  } catch (err) {
    console.error('Erreur lors de l\'upload du CV:', err);
    
    // Nettoyer le fichier en cas d'erreur
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Erreur serveur lors de l\'upload du CV' });
  }
}

export async function getMonCV(req, res) {
  try {
    const userId = req.user.id;

    // Récupérer les informations CV de l'étudiant
    const etudiantData = await db.select({
      cv: etudiants.cv,
      nom: users.nom,
      prenom: users.prenom,
      matricule: etudiants.matricule
    })
    .from(etudiants)
    .leftJoin(users, eq(etudiants.id, users.id))
    .where(eq(etudiants.id, userId));
    
    if (etudiantData.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux étudiants' });
    }

    const etudiant = etudiantData[0];
    
    if (!etudiant.cv) {
      return res.status(404).json({ error: 'Aucun CV trouvé' });
    }

    // Vérifier si le fichier existe
    const cheminCV = path.join('uploads', etudiant.cv);
    if (!fs.existsSync(cheminCV)) {
      return res.status(404).json({ error: 'Fichier CV introuvable sur le serveur' });
    }

    // Obtenir les informations du fichier
    const stats = fs.statSync(cheminCV);
    
    res.json({
      cv: {
        filename: etudiant.cv,
        path: `/uploads/${etudiant.cv}`,
        size: stats.size,
        dateUpload: stats.mtime
      },
      etudiant: {
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        matricule: etudiant.matricule
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du CV:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du CV' });
  }
}

export async function downloadCV(req, res) {
  try {
    const userId = req.user.id;
    const cvOwnerIdOrFilename = req.params.id; // Peut être un ID d'étudiant ou un nom de fichier

    let cvFilename = null;
    let etudiantInfo = null;

    // Si c'est un nom de fichier direct (pour les entreprises qui accèdent aux CVs via candidatures)
    if (cvOwnerIdOrFilename.includes('.pdf')) {
      cvFilename = cvOwnerIdOrFilename;
    } else {
      // Sinon, récupérer le CV de l'étudiant spécifié
      const etudiantData = await db.select({
        cv: etudiants.cv,
        nom: users.nom,
        prenom: users.prenom
      })
      .from(etudiants)
      .leftJoin(users, eq(etudiants.id, users.id))
      .where(eq(etudiants.id, cvOwnerIdOrFilename));
      
      if (etudiantData.length === 0 || !etudiantData[0].cv) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }
      
      cvFilename = etudiantData[0].cv;
      etudiantInfo = {
        nom: etudiantData[0].nom,
        prenom: etudiantData[0].prenom
      };
    }

    const cheminCV = path.join('uploads', cvFilename);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(cheminCV)) {
      return res.status(404).json({ error: 'Fichier CV introuvable' });
    }

    // Définir les en-têtes pour le téléchargement
    const displayName = etudiantInfo 
      ? `CV_${etudiantInfo.prenom}_${etudiantInfo.nom}.pdf`
      : cvFilename;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${displayName}"`);
    
    // Envoyer le fichier
    res.sendFile(path.resolve(cheminCV));
  } catch (err) {
    console.error('Erreur lors du téléchargement du CV:', err);
    res.status(500).json({ error: 'Erreur serveur lors du téléchargement du CV' });
  }
}

export async function deleteCV(req, res) {
  try {
    const userId = req.user.id;

    // Récupérer les informations de l'étudiant
    const etudiantData = await db.select({
      cv: etudiants.cv
    })
    .from(etudiants)
    .where(eq(etudiants.id, userId));
    
    if (etudiantData.length === 0) {
      return res.status(403).json({ error: 'Accès réservé aux étudiants' });
    }

    const etudiant = etudiantData[0];
    
    if (!etudiant.cv) {
      return res.status(404).json({ error: 'Aucun CV à supprimer' });
    }

    // Supprimer le fichier du disque
    const cheminCV = path.join('uploads', etudiant.cv);
    if (fs.existsSync(cheminCV)) {
      fs.unlinkSync(cheminCV);
    }

    // Mettre à jour le profil étudiant
    await db.update(etudiants)
      .set({ cv: null })
      .where(eq(etudiants.id, userId));

    res.json({ message: 'CV supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du CV:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du CV' });
  }
}

import { db } from '../db/drizzle.js';
import { notifications, users } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export async function createNotification(req, res) {
  try {
    const { userId, type, contenu, priorite = 'normale' } = req.body;
    const adminId = req.user.id;
    
    // Vérifier que l'utilisateur cible existe
    if (userId) {
      const user = await db.select().from(users).where(eq(users.id, userId));
      if (user.length === 0) {
        return res.status(404).json({ error: 'Utilisateur cible non trouvé' });
      }
    }
    
    // Créer la notification
    const [newNotification] = await db.insert(notifications).values({
      userId: userId || adminId,
      type: type || 'generale',
      contenu,
      priorite
    });
    
    res.status(201).json({ 
      message: 'Notification créée avec succès',
      notification: newNotification
    });
  } catch (err) {
    console.error('Erreur lors de la création de notification:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la création de notification' });
  }
}

export async function getMesNotifications(req, res) {
  try {
    const userId = req.user.id;
    const { limit = 20, estLue } = req.query;
    
    let query = db.select({
      id: notifications.id,
      type: notifications.type,
      contenu: notifications.contenu,
      dateEnvoi: notifications.dateEnvoi,
      estLue: notifications.estLue,
      priorite: notifications.priorite
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.dateEnvoi))
    .limit(parseInt(limit));
    
    // Filtrer par statut de lecture si spécifié
    if (estLue !== undefined) {
      query = query.where(eq(notifications.estLue, estLue === 'true' ? 1 : 0));
    }
    
    const mesNotifications = await query;
    
    res.json({
      notifications: mesNotifications,
      total: mesNotifications.length
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des notifications:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des notifications' });
  }
}

export async function marquerNotificationLue(req, res) {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    // Vérifier que la notification appartient à l'utilisateur
    const notification = await db.select()
      .from(notifications)
      .where(eq(notifications.id, notificationId) && eq(notifications.userId, userId));
    
    if (notification.length === 0) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }
    
    // Marquer comme lue
    await db.update(notifications)
      .set({ estLue: 1 })
      .where(eq(notifications.id, notificationId));
    
    res.json({ message: 'Notification marquée comme lue' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de notification:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour' });
  }
}

export async function marquerToutesLues(req, res) {
  try {
    const userId = req.user.id;
    
    // Marquer toutes les notifications non lues comme lues
    await db.update(notifications)
      .set({ estLue: 1 })
      .where(eq(notifications.userId, userId) && eq(notifications.estLue, 0));
    
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour des notifications:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour' });
  }
}

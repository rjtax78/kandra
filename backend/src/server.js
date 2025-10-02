import dotenv from 'dotenv';
import app from './app.js';
import { testConnection } from './db/drizzle.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Vérifier connexion DB avant de lancer le serveur
(async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    console.log('✅ Connexion MySQL réussie avec Drizzle ORM');

    app.listen(PORT, () => {
      console.log(`🚀 KANDRA Server démarré sur http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Erreur de connexion MySQL :', err.message);
    process.exit(1);
  }
})();

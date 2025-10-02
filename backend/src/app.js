import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import opportuniteRoutes from './routes/opportunite.js';
import candidatureRoutes from './routes/candidature.js';
import entrepriseRoutes from './routes/entreprise.js';
import candidatRoutes from './routes/candidat.js';
import cvRoutes from './routes/cv.js';
import partenaireRoutes from './routes/partenaire.js';
import ressourceRoutes from './routes/ressource.js';
import statistiqueRoutes from './routes/statistique.js';
import alerteRoutes from './routes/alerte.js';

import errorHandler from './middlewares/errorHandler.js'; // ✅ garder UNE SEULE fois
import logger from './middlewares/logger.js';

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/opportunite', opportuniteRoutes);
app.use('/api/candidature', candidatureRoutes);
app.use('/api/entreprise', entrepriseRoutes);
app.use('/api/candidat', candidatRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/partenaire', partenaireRoutes);
app.use('/api/ressource', ressourceRoutes);
app.use('/api/statistique', statistiqueRoutes);
app.use('/api/alerte', alerteRoutes);

// Route test
app.get('/', (req, res) => res.json({ ok: true }));

// Gestion des erreurs (toujours à la fin)
app.use(errorHandler);

export default app;

// Middleware global de gestion des erreurs
export default function errorHandler(err, req, res, next) {
  console.error('🔥 Erreur détectée :', err.stack || err);

  // Code HTTP par défaut
  const statusCode = err.status || 500;

  // Réponse JSON uniforme
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur serveur',
  });
}

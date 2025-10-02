// Middleware logger (simple)
// Tu peux plus tard remplacer par "morgan" ou "winston" si tu veux des logs avancés

export default function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
}

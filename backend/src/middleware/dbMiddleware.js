export const requireDatabase = (_req, res, next) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ message: "Database is not configured. Set DATABASE_URL in .env." });
  }
  return next();
};

import { isMongoConnected } from "../config/db.js";

export const requireDatabase = (_req, res, next) => {
  if (!isMongoConnected()) {
    return res.status(503).json({
      message:
        "MongoDB is not connected. Replace the placeholder MONGO_URI in backend/.env with your MongoDB Atlas connection string."
    });
  }

  return next();
};

import dotenv from "dotenv";

dotenv.config();

const placeholderTokens = ["<username>", "<password>", "<cluster-url>"];

export const env = {
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

export const isMongoUriConfigured = () => {
  return Boolean(env.mongoUri) && !placeholderTokens.some((token) => env.mongoUri.includes(token));
};

export const validateStartupEnv = () => {
  const missing = [];

  if (!env.jwtSecret) missing.push("JWT_SECRET");
  if (!env.adminEmail) missing.push("ADMIN_EMAIL");
  if (!env.adminPassword) missing.push("ADMIN_PASSWORD");

  if (missing.length) {
    throw new Error(`Missing required authentication environment variables: ${missing.join(", ")}`);
  }

  if (!isMongoUriConfigured()) {
    console.warn(
      "MongoDB Atlas is not configured yet. Replace MONGO_URI in backend/.env with your real Atlas connection string."
    );
  }
};

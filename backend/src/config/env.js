import dotenv from "dotenv";

dotenv.config();

const placeholderTokens = ["<username>", "<password>", "<cluster-url>"];

export const env = {
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES || process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

export const isDatabaseConfigured = () => {
  return Boolean(env.databaseUrl);
};

export const validateStartupEnv = () => {
  const missing = [];

  if (!env.jwtSecret) missing.push("JWT_SECRET");
  if (!env.adminEmail) missing.push("ADMIN_EMAIL");
  if (!env.adminPassword) missing.push("ADMIN_PASSWORD");

  if (missing.length) {
    throw new Error(`Missing required authentication environment variables: ${missing.join(", ")}`);
  }

  if (!isDatabaseConfigured()) {
    console.warn(
      "DATABASE_URL is not configured yet. Set DATABASE_URL in backend/.env to your Postgres connection string."
    );
  }
};

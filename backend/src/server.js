import { env, validateStartupEnv } from "./config/env.js";
import app from "./app.js";
import prisma from "./config/prismaClient.js";

const PORT = env.port;

const startServer = async () => {
  try {
    validateStartupEnv();
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }

  try {
    await prisma.$connect();
    console.log('Connected to Postgres via Prisma');
  } catch (error) {
    console.error('Prisma connection failed:', error.message);
    // continue; requireDatabase middleware will block endpoints when DATABASE_URL missing
  }

  app.listen(PORT, () => {
    console.log(`AmiSphere API running on port ${PORT}`);
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Allowed client URL(s): ${env.clientUrl}`);
  });
};

startServer();

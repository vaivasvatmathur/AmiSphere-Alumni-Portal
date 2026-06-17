import { env, validateStartupEnv } from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = env.port;

const startServer = async () => {
  let isDbConnected = false;

  try {
    validateStartupEnv();
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }

  try {
    isDbConnected = await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log("Server will continue running. Alumni data routes will return 503 until MongoDB connects.");
  }

  app.listen(PORT, () => {
    console.log(`AmiSphere API running on port ${PORT}`);
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Allowed client URL(s): ${env.clientUrl}`);
    if (!isDbConnected) {
      console.log("Auth routes are available. Alumni data routes will return 503 until MongoDB is configured.");
    }
  });
};

startServer();

import mongoose from "mongoose";
import { env, isMongoUriConfigured } from "./env.js";

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);

  if (!isMongoUriConfigured()) {
    console.warn("MongoDB connection skipped because MONGO_URI is still a placeholder.");
    return false;
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  return true;
};

export const isMongoConnected = () => mongoose.connection.readyState === 1;

export default connectDB;

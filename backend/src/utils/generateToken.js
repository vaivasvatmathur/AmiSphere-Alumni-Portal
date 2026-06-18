import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const generateToken = (payload) => {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};

export default generateToken;

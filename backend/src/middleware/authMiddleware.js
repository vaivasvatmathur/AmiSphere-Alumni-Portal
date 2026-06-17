import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    const error = new Error("Not authorized. Admin token is required.");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.role !== "admin") {
      const error = new Error("Not authorized for this admin portal.");
      error.statusCode = 403;
      throw error;
    }

    req.admin = decoded;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.message = error.message || "Invalid or expired token.";
    throw error;
  }
});

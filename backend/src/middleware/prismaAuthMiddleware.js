import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";
import { env } from "../config/env.js";

export const verifyToken = async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    const err = new Error("Not authorized. Token required.");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret || process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 401;
      return next(err);
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

export const requireRole = (role) => (req, _res, next) => {
  if (!req.user || req.user.role !== role) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  next();
};

export const requireSelfOrAdmin = async (req, _res, next) => {
  const targetId = req.params.id;
  if (req.user.role === 'ADMIN') {
    return next();
  }

  try {
    const alumni = await prisma.alumni.findUnique({ where: { id: targetId } });
    if (alumni && alumni.userId === req.user.id) {
      return next();
    }

    const err = new Error('Forbidden');
    err.statusCode = 403;
    return next(err);
  } catch (error) {
    error.statusCode = 403;
    next(error);
  }
};

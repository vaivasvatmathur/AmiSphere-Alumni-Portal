import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = env.adminEmail;
  const adminPassword = env.adminPassword;

  if (!adminEmail || !adminPassword) {
    const error = new Error("Admin credentials are not configured on the server.");
    error.statusCode = 500;
    throw error;
  }

  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const emailMatches = String(email).toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches =
    adminPassword.startsWith("$2") && adminPassword.length > 50
      ? await bcrypt.compare(password, adminPassword)
      : password === adminPassword;

  if (!emailMatches || !passwordMatches) {
    const error = new Error("Invalid admin credentials.");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    role: "admin",
    email: adminEmail
  });

  res.json({
    token,
    admin: {
      email: adminEmail,
      role: "admin"
    }
  });
});

export const getAdminProfile = asyncHandler(async (req, res) => {
  res.json({
    admin: {
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

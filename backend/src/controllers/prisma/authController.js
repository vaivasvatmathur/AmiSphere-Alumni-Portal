import asyncHandler from "../../utils/asyncHandler.js";
import prisma from "../../config/prismaClient.js";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    const err = new Error("Email and password are required.");
    err.statusCode = 400;
    throw err;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, password: hashed, role: 'ALUMNI' } });

  if (req.body.fullName || req.body.enrollmentNumber) {
    try {
      await prisma.alumni.create({ data: { userId: user.id, fullName: req.body.fullName || user.name || '', enrollmentNumber: req.body.enrollmentNumber || '', batch: req.body.batch || '', course: req.body.course || 'BTECH_IT', email: user.email } });
    } catch (e) {
      // ignore alumni create failures here
    }
  }

  const token = generateToken({ sub: user.id, role: user.role });
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("Email and password are required.");
    err.statusCode = 400;
    throw err;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

  const token = generateToken({ sub: user.id, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { alumni: true } });
  res.json({ user });
});

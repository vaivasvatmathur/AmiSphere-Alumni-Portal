import express from "express";
import { register, login, getProfile } from "../controllers/prisma/authController.js";
import { verifyToken } from "../middleware/prismaAuthMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getProfile);

export default router;

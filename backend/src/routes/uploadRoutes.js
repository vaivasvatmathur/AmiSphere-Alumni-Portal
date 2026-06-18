import express from "express";
import { bulkUploadAlumni } from "../controllers/uploadController.js";
import { requireDatabase } from "../middleware/dbMiddleware.js";
import { verifyToken, requireRole } from "../middleware/prismaAuthMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/alumni", verifyToken, requireDatabase, requireRole('ADMIN'), upload.single("file"), bulkUploadAlumni);

export default router;

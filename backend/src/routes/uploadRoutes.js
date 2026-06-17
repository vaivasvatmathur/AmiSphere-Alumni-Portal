import express from "express";
import { bulkUploadAlumni } from "../controllers/uploadController.js";
import { requireDatabase } from "../middleware/dbMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/alumni", protect, requireDatabase, upload.single("file"), bulkUploadAlumni);

export default router;

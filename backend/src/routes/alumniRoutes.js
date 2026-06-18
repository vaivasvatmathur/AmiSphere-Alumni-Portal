import express from "express";
import {
  createAlumni,
  deleteAlumni,
  getAllAlumni,
  getAlumniById,
  getAlumniFilterOptions,
  getAlumniStats,
  updateAlumni
} from "../controllers/prisma/alumniController.js";
import { requireDatabase } from "../middleware/dbMiddleware.js";
import { verifyToken, requireRole, requireSelfOrAdmin } from "../middleware/prismaAuthMiddleware.js";

const router = express.Router();

router.use(verifyToken, requireDatabase);

router.route("/").get(getAllAlumni).post(requireRole('ADMIN'), createAlumni);
router.get("/filters", getAlumniFilterOptions);
router.get("/stats", getAlumniStats);
router.route("/:id").get(getAlumniById).put(requireSelfOrAdmin, updateAlumni).delete(requireRole('ADMIN'), deleteAlumni);

export default router;

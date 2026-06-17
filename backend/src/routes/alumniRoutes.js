import express from "express";
import {
  createAlumni,
  deleteAlumni,
  getAllAlumni,
  getAlumniById,
  getAlumniFilterOptions,
  getAlumniStats,
  updateAlumni
} from "../controllers/alumniController.js";
import { requireDatabase } from "../middleware/dbMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, requireDatabase);

router.route("/").get(getAllAlumni).post(createAlumni);
router.get("/filters", getAlumniFilterOptions);
router.get("/stats", getAlumniStats);
router.route("/:id").get(getAlumniById).put(updateAlumni).delete(deleteAlumni);

export default router;

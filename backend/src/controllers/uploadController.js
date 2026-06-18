import asyncHandler from "../utils/asyncHandler.js";
import { importAlumniFile } from "../services/prisma/uploadService.js";

export const bulkUploadAlumni = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Please upload a CSV or XLSX file.");
    error.statusCode = 400;
    throw error;
  }

  console.info("bulk-upload:started", {
    path: req.file.path,
    originalName: req.file.originalname,
    uploader: req.user?.id
  });

  const result = await importAlumniFile(req.file.path);

  console.info("bulk-upload:completed", {
    totalRows: result.totalRows,
    inserted: result.inserted,
    duplicates: result.duplicates,
    failed: result.failed
  });

  res.status(201).json({
    message: "Bulk upload processed.",
    ...result
  });
});

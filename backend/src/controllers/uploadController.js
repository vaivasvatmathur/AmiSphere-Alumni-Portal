import asyncHandler from "../utils/asyncHandler.js";
import { importAlumniFile } from "../services/uploadService.js";

export const bulkUploadAlumni = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Please upload a CSV or XLSX file.");
    error.statusCode = 400;
    throw error;
  }

  const result = await importAlumniFile(req.file.path);

  res.status(201).json({
    message: "Bulk upload processed.",
    ...result
  });
});

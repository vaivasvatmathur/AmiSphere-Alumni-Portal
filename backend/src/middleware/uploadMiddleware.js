import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, "uploads/");
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const allowedExtensions = [".csv", ".xlsx"];

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return callback(new Error("Only .csv and .xlsx files are supported."));
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

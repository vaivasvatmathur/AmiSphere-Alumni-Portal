import fs from "fs/promises";
import xlsx from "xlsx";
import Alumni from "../models/Alumni.js";
import { normalizeCourse, parseList } from "../utils/queryHelpers.js";

const keyAliases = {
  photo: ["photo", "photo url", "image", "image url"],
  fullName: ["fullname", "full name", "name", "alumni name"],
  enrollmentNumber: [
    "enrollmentnumber",
    "enrollment number",
    "enrollment no",
    "enroll no",
    "enrollment"
  ],
  batch: ["batch", "graduation year", "passing year", "year"],
  course: ["course", "program", "degree"],
  phone: ["phone", "phone number", "mobile", "contact"],
  email: ["email", "email id", "mail"],
  company: ["company", "current company", "organization", "employer"],
  position: ["position", "current position", "job role", "profession", "designation"],
  skills: ["skills", "skill", "technical skills"],
  linkedinUrl: ["linkedinurl", "linkedin url", "linkedin", "linkedin profile"]
};

const getValue = (row, field) => {
  const normalizedRow = Object.entries(row).reduce((acc, [key, value]) => {
    acc[String(key).trim().toLowerCase()] = value;
    return acc;
  }, {});

  for (const alias of keyAliases[field]) {
    if (normalizedRow[alias] !== undefined) {
      return normalizedRow[alias];
    }
  }

  return "";
};

const normalizeRow = (row) => ({
  photo: String(getValue(row, "photo") || "").trim(),
  fullName: String(getValue(row, "fullName") || "").trim(),
  enrollmentNumber: String(getValue(row, "enrollmentNumber") || "").trim().toUpperCase(),
  batch: String(getValue(row, "batch") || "").trim(),
  course: normalizeCourse(getValue(row, "course")),
  phone: String(getValue(row, "phone") || "").trim(),
  email: String(getValue(row, "email") || "").trim().toLowerCase(),
  company: String(getValue(row, "company") || "").trim(),
  position: String(getValue(row, "position") || "").trim(),
  skills: parseList(getValue(row, "skills")),
  linkedinUrl: String(getValue(row, "linkedinUrl") || "").trim()
});

const parseSpreadsheet = (filePath) => {
  const workbook = xlsx.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) return [];

  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
    raw: false
  });
};

export const importAlumniFile = async (filePath) => {
  const rows = parseSpreadsheet(filePath);
  const result = {
    totalRows: rows.length,
    successCount: 0,
    failureCount: 0,
    failures: []
  };

  for (const [index, rawRow] of rows.entries()) {
    const rowNumber = index + 2;
    const payload = normalizeRow(rawRow);

    try {
      const duplicate = await Alumni.findOne({
        $or: [{ enrollmentNumber: payload.enrollmentNumber }, { email: payload.email }]
      });

      if (duplicate) {
        throw new Error("Duplicate enrollment number or email.");
      }

      await Alumni.create(payload);
      result.successCount += 1;
    } catch (error) {
      result.failureCount += 1;
      result.failures.push({
        row: rowNumber,
        enrollmentNumber: payload.enrollmentNumber || "N/A",
        reason:
          error.name === "ValidationError"
            ? Object.values(error.errors).map((item) => item.message).join(" ")
            : error.message
      });
    }
  }

  await fs.unlink(filePath).catch(() => {});
  return result;
};

import { parseList } from "./queryHelpers.js";
import { normalizeCourseToEnum } from "./courseHelper.js";

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

export const normalizeRow = (row) => ({
  photo: String(getValue(row, "photo") || "").trim(),
  fullName: String(getValue(row, "fullName") || "").trim(),
  enrollmentNumber: String(getValue(row, "enrollmentNumber") || "").trim().toUpperCase(),
  batch: String(getValue(row, "batch") || "").trim(),
  course: normalizeCourseToEnum(getValue(row, "course")),
  phone: String(getValue(row, "phone") || "").trim(),
  email: String(getValue(row, "email") || "").trim().toLowerCase(),
  company: String(getValue(row, "company") || "").trim(),
  position: String(getValue(row, "position") || "").trim(),
  skills: parseList(getValue(row, "skills")).map((s) => String(s).trim().toLowerCase()),
  linkedinUrl: String(getValue(row, "linkedinUrl") || "").trim()
});

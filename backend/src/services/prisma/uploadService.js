import { createReadStream } from "fs";
import fs from "fs/promises";
import path from "path";
import csvParser from "csv-parser";
import xlsx from "xlsx";
import bcrypt from "bcrypt";
import prisma from "../../config/prismaClient.js";
import { normalizeRow } from "../../utils/uploadNormalizer.js";

const allowedCourses = ["BTECH_IT", "BTECH_CSBS", "BTECH_CSSS"];

const parseCsvFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    createReadStream(filePath)
      .on("error", (error) => reject(error))
      .pipe(csvParser({ mapHeaders: ({ header }) => String(header || "").trim() }))
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows));
  });
};

const parseSpreadsheetFile = async (filePath) => {
  const workbook = xlsx.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "", raw: false });
};

const validateEmail = (value) => {
  return typeof value === "string" && /^\S+@\S+\.\S+$/.test(value.trim());
};

const validateRow = (payload) => {
  const errors = [];
  if (!payload.fullName) errors.push("Missing fullName");
  if (!payload.enrollmentNumber) errors.push("Missing enrollmentNumber");
  if (!payload.batch) errors.push("Missing batch");
  if (!payload.course) errors.push("Missing course");
  if (!payload.email) errors.push("Missing email");
  if (payload.email && !validateEmail(payload.email)) errors.push("Invalid email format");
  if (payload.course && !allowedCourses.includes(payload.course)) errors.push("Invalid course value");
  return errors;
};

const parseFileRows = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".csv") {
    return parseCsvFile(filePath);
  }
  if (extension === ".xlsx") {
    return parseSpreadsheetFile(filePath);
  }
  throw new Error("Unsupported file type.");
};

export const importAlumniFile = async (filePath) => {
  let rawRows = [];
  try {
    rawRows = await parseFileRows(filePath);
  } catch (error) {
    await fs.unlink(filePath).catch(() => {});
    throw new Error(error.message || "Unable to parse uploaded file.");
  }

  const seenEnrollment = new Set();
  const seenEmail = new Set();
  const normalizedRows = rawRows.map((row, index) => ({ row, rowNumber: index + 2 }));
  const result = {
    totalRows: normalizedRows.length,
    inserted: 0,
    duplicates: 0,
    failed: 0,
    errors: []
  };

  if (!normalizedRows.length) {
    await fs.unlink(filePath).catch(() => {});
    return result;
  }

  const enrollmentNumbers = normalizedRows
    .map(({ row }) => String(row.enrollmentNumber || "").trim().toUpperCase())
    .filter(Boolean);
  const emails = normalizedRows
    .map(({ row }) => String(row.email || "").trim().toLowerCase())
    .filter(Boolean);

  const [existingAlumni, existingUsers] = await Promise.all([
    prisma.alumni.findMany({
      where: {
        OR: [
          { enrollmentNumber: { in: enrollmentNumbers } },
          { email: { in: emails } }
        ]
      },
      select: { enrollmentNumber: true, email: true }
    }),
    prisma.user.findMany({
      where: {
        email: { in: emails }
      },
      select: { id: true, email: true }
    })
  ]);

  const existingEnrollmentNumbers = new Set(existingAlumni.map((item) => item.enrollmentNumber));
  const existingEmails = new Set(existingAlumni.map((item) => item.email));
  const userMap = new Map(existingUsers.map((item) => [item.email, item.id]));

  const validRows = [];

  for (const { row, rowNumber } of normalizedRows) {
    const payload = normalizeRow(row);
    const rowErrors = validateRow(payload);

    if (payload.enrollmentNumber && (existingEnrollmentNumbers.has(payload.enrollmentNumber) || seenEnrollment.has(payload.enrollmentNumber))) {
      rowErrors.push("Duplicate enrollment number");
    }
    if (payload.email && (existingEmails.has(payload.email) || seenEmail.has(payload.email))) {
      rowErrors.push("Duplicate email");
    }

    if (rowErrors.length) {
      result.failed += 1;
      result.errors.push({ row: rowNumber, reason: rowErrors.join("; ") });
      continue;
    }

    seenEnrollment.add(payload.enrollmentNumber);
    seenEmail.add(payload.email);
    validRows.push({ rowNumber, payload });
  }

  if (!validRows.length) {
    await fs.unlink(filePath).catch(() => {});
    return result;
  }

  const userCreation = [];
  for (const { payload } of validRows) {
    if (!userMap.has(payload.email)) {
      const randomPassword = Math.random().toString(36).slice(2, 10);
      const hashPromise = bcrypt.hash(randomPassword, 12);
      userCreation.push({ payload, hashPromise });
    }
  }

  for (const item of userCreation) {
    const hashedPassword = await item.hashPromise;
    const user = await prisma.user.create({
      data: {
        name: item.payload.fullName || undefined,
        email: item.payload.email,
        password: hashedPassword,
        role: "ALUMNI"
      }
    });
    userMap.set(user.email, user.id);
  }

  const createData = validRows.map(({ payload }) => ({
    userId: userMap.get(payload.email),
    photo: payload.photo || null,
    fullName: payload.fullName,
    enrollmentNumber: payload.enrollmentNumber,
    batch: payload.batch,
    course: payload.course,
    phone: payload.phone || null,
    email: payload.email,
    company: payload.company || null,
    position: payload.position || null,
    skills: payload.skills || [],
    linkedinUrl: payload.linkedinUrl || null,
    status: "PENDING",
    isProfileComplete: false
  }));

  const created = await prisma.alumni.createMany({ data: createData, skipDuplicates: true });
  result.inserted = created.count;
  result.duplicates = validRows.length - created.count;
  result.failed += result.duplicates;

  console.info("bulk-upload:rows-processed", {
    totalRows: result.totalRows,
    validRows: validRows.length,
    inserted: result.inserted,
    duplicates: result.duplicates,
    failed: result.failed
  });

  await fs.unlink(filePath).catch(() => {});
  return result;
};

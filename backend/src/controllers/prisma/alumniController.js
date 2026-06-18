import asyncHandler from "../../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import prisma from "../../config/prismaClient.js";
import { parseList } from "../../utils/queryHelpers.js";
import { normalizeCourseToEnum } from "../../utils/courseHelper.js";
import { validateAlumniPayload } from "../../utils/validation.js";

export const createAlumni = asyncHandler(async (req, res) => {
  const payload = req.body;
  const errors = validateAlumniPayload(payload, { creating: true });
  if (errors.length) {
    const err = new Error(errors.join(" "));
    err.statusCode = 400;
    throw err;
  }

  // normalize
  payload.course = normalizeCourseToEnum(payload.course);
  payload.skills = parseList(payload.skills).map((s) => String(s).trim().toLowerCase());

  // duplicate check
  const duplicate = await prisma.alumni.findFirst({ where: { OR: [{ enrollmentNumber: payload.enrollmentNumber }, { email: payload.email }] } });
  if (duplicate) {
    const err = new Error("Duplicate enrollment number or email.");
    err.statusCode = 400;
    throw err;
  }

  // ensure user exists or create one
  let user = null;
  if (payload.userId) {
    user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      const err = new Error("Linked user not found.");
      err.statusCode = 400;
      throw err;
    }
  } else {
    // create a user account for this alumni
    const randomPassword = Math.random().toString(36).slice(2, 10);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);
    user = await prisma.user.create({
      data: {
        name: payload.fullName || undefined,
        email: payload.email,
        password: hashedPassword,
        role: 'ALUMNI'
      }
    });
  }

  const alumni = await prisma.alumni.create({
    data: {
      userId: user.id,
      photo: payload.photo || null,
      fullName: payload.fullName,
      enrollmentNumber: payload.enrollmentNumber,
      batch: payload.batch,
      course: payload.course,
      phone: payload.phone || null,
      email: payload.email,
      company: payload.company || null,
      position: payload.position || null,
      skills: payload.skills,
      linkedinUrl: payload.linkedinUrl || null,
      status: payload.status || undefined,
      isProfileComplete: payload.isProfileComplete || false
    }
  });

  res.status(201).json(alumni);
});

export const getAllAlumni = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 10000);
  const skip = (page - 1) * limit;
  const allowedSortFields = ["createdAt", "fullName", "batch", "course", "company", "position", "enrollmentNumber", "status"];
  const sortBy = allowedSortFields.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

  const search = (req.query.search || "").trim();
  const batches = parseList(req.query.batch);
  const courses = parseList(req.query.course).map(normalizeCourseToEnum).filter(Boolean);
  const skills = parseList(req.query.skills).map((s) => s.toLowerCase());
  const company = (req.query.company || "").trim();
  const position = (req.query.position || req.query.profession || "").trim();

  const where = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { enrollmentNumber: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }

  if (batches.length) where.batch = { in: batches };
  if (courses.length) where.course = { in: courses };
  if (skills.length) where.skills = { hasEvery: skills };
  if (company) where.company = { contains: company, mode: "insensitive" };
  if (position) where.position = { contains: position, mode: "insensitive" };

  const [items, total] = await Promise.all([
    prisma.alumni.findMany({ where, orderBy: { [sortBy]: sortOrder }, skip, take: limit }),
    prisma.alumni.count({ where })
  ]);

  res.json({ items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } });
});

export const getAlumniById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const alumni = await prisma.alumni.findUnique({ where: { id } });
  if (!alumni) {
    const err = new Error("Alumni record not found.");
    err.statusCode = 404;
    throw err;
  }
  res.json(alumni);
});

export const updateAlumni = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  if (payload.course) payload.course = normalizeCourseToEnum(payload.course);
  if (payload.skills) payload.skills = parseList(payload.skills).map((s) => s.toLowerCase());

  const alumni = await prisma.alumni.update({ where: { id }, data: payload });
  res.json(alumni);
});

export const deleteAlumni = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.alumni.delete({ where: { id } });
  res.json({ message: "Alumni record deleted." });
});

export const getAlumniFilterOptions = asyncHandler(async (_req, res) => {
  const batches = await prisma.alumni.groupBy({ by: ["batch"], _count: { _all: true } });
  const courses = await prisma.alumni.groupBy({ by: ["course"], _count: { _all: true } });
  const companies = await prisma.alumni.groupBy({ by: ["company"], _count: { _all: true } });
  const positions = await prisma.alumni.groupBy({ by: ["position"], _count: { _all: true } });

  // skills: unnest via raw query
  const skillsRaw = await prisma.$queryRaw`SELECT DISTINCT unnest("skills") as skill FROM "Alumni" WHERE array_length("skills",1) IS NOT NULL;`;
  const skills = skillsRaw.map((r) => r.skill).filter(Boolean).sort();

  res.json({
    batches: batches.map((b) => b.batch).filter(Boolean).sort(),
    courses: courses.map((c) => c.course).filter(Boolean).sort(),
    companies: companies.map((c) => c.company).filter(Boolean).sort(),
    positions: positions.map((p) => p.position).filter(Boolean).sort(),
    skills
  });
});

export const getAlumniStats = asyncHandler(async (_req, res) => {
  const total = await prisma.alumni.count();
  const courseGroups = await prisma.alumni.groupBy({ by: ["course"], _count: { _all: true } });
  const batches = await prisma.alumni.groupBy({ by: ["batch"], _count: { _all: true } });
  const companies = await prisma.alumni.groupBy({ by: ["company"], _count: { _all: true } });

  res.json({
    total,
    courseBreakdown: courseGroups.map((g) => ({ _id: g.course, count: g._count._all })),
    batchCount: batches.filter((b) => b.batch).length,
    companyCount: companies.filter((c) => c.company).length
  });
});

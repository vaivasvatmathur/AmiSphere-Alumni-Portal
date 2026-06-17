import mongoose from "mongoose";
import Alumni from "../models/Alumni.js";
import asyncHandler from "../utils/asyncHandler.js";
import { escapeRegex, normalizeCourse, parseList } from "../utils/queryHelpers.js";

const buildAlumniQuery = (queryParams) => {
  const query = {};
  const search = queryParams.search?.trim();
  const batches = parseList(queryParams.batch);
  const courses = parseList(queryParams.course).map(normalizeCourse);
  const skills = parseList(queryParams.skills);
  const company = queryParams.company?.trim();
  const position = queryParams.position?.trim() || queryParams.profession?.trim();

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { fullName: regex },
      { enrollmentNumber: regex },
      { company: regex },
      { skills: regex },
      { email: regex }
    ];
  }

  if (batches.length) query.batch = { $in: batches };
  if (courses.length) query.course = { $in: courses };
  if (skills.length) {
    query.skills = { $all: skills.map((skill) => new RegExp(escapeRegex(skill), "i")) };
  }
  if (company) query.company = new RegExp(escapeRegex(company), "i");
  if (position) query.position = new RegExp(escapeRegex(position), "i");

  return query;
};

export const createAlumni = asyncHandler(async (req, res) => {
  const alumni = await Alumni.create({
    ...req.body,
    course: normalizeCourse(req.body.course),
    skills: parseList(req.body.skills)
  });

  res.status(201).json(alumni);
});

export const getAllAlumni = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 10000);
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const query = buildAlumniQuery(req.query);

  const [items, total] = await Promise.all([
    Alumni.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
    Alumni.countDocuments(query)
  ]);

  res.json({
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  });
});

export const getAlumniById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const error = new Error("Invalid alumni id.");
    error.statusCode = 400;
    throw error;
  }

  const alumni = await Alumni.findById(req.params.id);

  if (!alumni) {
    const error = new Error("Alumni record not found.");
    error.statusCode = 404;
    throw error;
  }

  res.json(alumni);
});

export const updateAlumni = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const error = new Error("Invalid alumni id.");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    ...req.body,
    course: normalizeCourse(req.body.course),
    skills: parseList(req.body.skills)
  };

  const alumni = await Alumni.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!alumni) {
    const error = new Error("Alumni record not found.");
    error.statusCode = 404;
    throw error;
  }

  res.json(alumni);
});

export const deleteAlumni = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const error = new Error("Invalid alumni id.");
    error.statusCode = 400;
    throw error;
  }

  const alumni = await Alumni.findByIdAndDelete(req.params.id);

  if (!alumni) {
    const error = new Error("Alumni record not found.");
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: "Alumni record deleted." });
});

export const getAlumniFilterOptions = asyncHandler(async (_req, res) => {
  const [batches, courses, companies, positions, skillGroups] = await Promise.all([
    Alumni.distinct("batch"),
    Alumni.distinct("course"),
    Alumni.distinct("company"),
    Alumni.distinct("position"),
    Alumni.distinct("skills")
  ]);

  res.json({
    batches: batches.filter(Boolean).sort(),
    courses: courses.filter(Boolean).sort(),
    companies: companies.filter(Boolean).sort(),
    positions: positions.filter(Boolean).sort(),
    skills: skillGroups.filter(Boolean).sort()
  });
});

export const getAlumniStats = asyncHandler(async (_req, res) => {
  const [total, courses, batches, companies] = await Promise.all([
    Alumni.countDocuments(),
    Alumni.aggregate([{ $group: { _id: "$course", count: { $sum: 1 } } }]),
    Alumni.distinct("batch"),
    Alumni.distinct("company")
  ]);

  res.json({
    total,
    courseBreakdown: courses,
    batchCount: batches.filter(Boolean).length,
    companyCount: companies.filter(Boolean).length
  });
});

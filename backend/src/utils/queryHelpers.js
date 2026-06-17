export const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(parseList);

  return String(value)
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const normalizeCourse = (course = "") => {
  const cleaned = String(course).trim().replace(/\s+/g, " ");
  const courseMap = {
    "b.tech it": "B.Tech IT",
    "btech it": "B.Tech IT",
    it: "B.Tech IT",
    "b.tech csbs": "B.Tech CSBS",
    "btech csbs": "B.Tech CSBS",
    csbs: "B.Tech CSBS",
    "b.tech csss": "B.Tech CSSS",
    "btech csss": "B.Tech CSSS",
    csss: "B.Tech CSSS"
  };

  return courseMap[cleaned.toLowerCase()] || cleaned;
};

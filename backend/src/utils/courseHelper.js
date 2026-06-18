export const normalizeCourseToEnum = (course = "") => {
  const cleaned = String(course || "").trim().toLowerCase();
  if (!cleaned) return null;
  if (cleaned.includes("it")) return "BTECH_IT";
  if (cleaned.includes("csbs")) return "BTECH_CSBS";
  if (cleaned.includes("csss")) return "BTECH_CSSS";
  // fallback: attempt known tokens
  const map = {
    'b.tech it': 'BTECH_IT',
    'btech it': 'BTECH_IT',
    'b.tech csbs': 'BTECH_CSBS',
    'btech csbs': 'BTECH_CSBS',
    'b.tech csss': 'BTECH_CSSS',
    'btech csss': 'BTECH_CSSS'
  };
  return map[cleaned] || null;
};

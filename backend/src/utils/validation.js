export const validateAlumniPayload = (payload = {}, options = {}) => {
  const errors = [];
  if (options.creating) {
    if (!payload.fullName || String(payload.fullName).trim().length < 2) errors.push('Full name must be at least 2 characters.');
    if (!payload.enrollmentNumber) errors.push('Enrollment number is required.');
    if (!payload.batch || !/^\d{4}$/.test(String(payload.batch))) errors.push('Batch must be a four-digit year.');
    if (!payload.course) errors.push('Course is required.');
    if (!payload.email || !/^\S+@\S+\.\S+$/.test(String(payload.email))) errors.push('Valid email is required.');
  }
  return errors;
};

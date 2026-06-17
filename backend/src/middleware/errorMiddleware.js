export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || error.status || 500;

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed.",
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue || {})[0] || "field";
    return res.status(409).json({
      message: `An alumni record with this ${duplicateField} already exists.`
    });
  }

  return res.status(statusCode).json({
    message: error.message || "Internal server error."
  });
};

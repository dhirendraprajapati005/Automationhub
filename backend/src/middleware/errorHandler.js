// Catches errors thrown/passed via next(err) anywhere in the app and
// returns a consistent JSON error shape. Never leaks stack traces in prod.
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // Mongoose duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} is already in use`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Multer upload errors (file too large, wrong field, etc.) and our own
  // fileFilter rejection — both arrive as plain Errors, not Mongoose errors,
  // so they'd otherwise fall through to a generic 500.
  if (err.name === "MulterError" || /file type .* is not allowed/i.test(err.message || "")) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

// Wraps an async route handler so rejected promises are forwarded to
// errorHandler instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

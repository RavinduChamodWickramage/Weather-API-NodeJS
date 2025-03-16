const AppError = require("../utils/appError");

const errorHandler = (err, req, res, next) => {
  let error = {
    ...err,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  console.error(`Error: ${error.message}`);

  if (err.name === "CastError") {
    error = new AppError(`Invalid resource ID: ${err.value}`, 400);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 409);
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new AppError(messages.join(". "), 400);
  }

  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401);
  }
  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? error.message
        : error.fullMessage || error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorHandler;

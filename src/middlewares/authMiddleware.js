const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/appError");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer") || req.cookies?.jwt) {
    token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("+active");

    if (!user?.active) {
      return next(new AppError("User account is disabled", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired"
        : "Invalid authentication token";
    return next(new AppError(message, 401));
  }
});

module.exports = { protect };

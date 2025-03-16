const { body, param, query, validationResult } = require("express-validator");
const AppError = require("../utils/appError");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("location.coordinates")
    .isArray()
    .withMessage("Location coordinates must be an array")
    .custom((value) => {
      if (value.length !== 2) {
        throw new Error(
          "Coordinates must contain exactly 2 values [longitude, latitude]"
        );
      }
      if (value[0] < -180 || value[0] > 180) {
        throw new Error("Longitude must be between -180 and 180");
      }
      if (value[1] < -90 || value[1] > 90) {
        throw new Error("Latitude must be between -90 and 90");
      }
      return true;
    }),
  validateRequest,
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validateRequest,
];

const updateLocationValidation = [
  body("coordinates")
    .isArray()
    .withMessage("Location coordinates must be an array")
    .custom((value) => {
      if (value.length !== 2) {
        throw new Error(
          "Coordinates must contain exactly 2 values [longitude, latitude]"
        );
      }
      if (value[0] < -180 || value[0] > 180) {
        throw new Error("Longitude must be between -180 and 180");
      }
      if (value[1] < -90 || value[1] > 90) {
        throw new Error("Latitude must be between -90 and 90");
      }
      return true;
    }),
  validateRequest,
];

const getWeatherValidation = [
  query("date")
    .optional()
    .isDate()
    .withMessage("Date must be in ISO format (YYYY-MM-DD)"),
  validateRequest,
];

module.exports = {
  registerValidation,
  loginValidation,
  updateLocationValidation,
  getWeatherValidation,
};

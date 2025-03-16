const { body, query } = require("express-validator");
const AppError = require("../utils/appError");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new AppError(messages.join("; "), 400));
  }
  next();
};

const coordinateValidator = (value) => {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new Error("Coordinates must be [longitude, latitude] array");
  }
  if (typeof value[0] !== "number" || value[0] < -180 || value[0] > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }
  if (typeof value[1] !== "number" || value[1] < -90 || value[1] > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }
  return true;
};

const commonValidations = {
  email: body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email required")
    .normalizeEmail(),

  password: body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be 8+ characters")
    .matches(/[A-Z]/)
    .withMessage("Password needs uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password needs lowercase letter")
    .matches(/\d/)
    .withMessage("Password needs number"),

  coordinates: body("location.coordinates").custom(coordinateValidator),
};

const registerValidation = [
  commonValidations.email,
  commonValidations.password,
  commonValidations.coordinates,
  validateRequest,
];

const loginValidation = [
  commonValidations.email,
  body("password").exists().withMessage("Password required"),
  validateRequest,
];

const updateLocationValidation = [
  body("coordinates").custom(coordinateValidator),
  validateRequest,
];

const getWeatherValidation = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be ISO8601 (YYYY-MM-DD)")
    .toDate(),
  validateRequest,
];

module.exports = {
  registerValidation,
  loginValidation,
  updateLocationValidation,
  getWeatherValidation,
  validateRequest,
};

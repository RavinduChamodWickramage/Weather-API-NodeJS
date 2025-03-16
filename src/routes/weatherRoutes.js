const express = require("express");
const {
  getUserWeatherData,
  getCurrentWeather,
} = require("../controllers/weatherController");
const { getWeatherValidation } = require("../middlewares/validationMiddleware");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getWeatherValidation, getUserWeatherData);
router.get("/current", protect, getCurrentWeather);

module.exports = router;

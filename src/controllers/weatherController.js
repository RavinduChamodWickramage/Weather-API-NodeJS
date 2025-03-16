const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { getWeatherData } = require("../services/weatherService");

const getUserWeatherData = asyncHandler(async (req, res, next) => {
  const dateParam = req.query.date;

  let query = { _id: req.user._id };

  if (dateParam) {
    const targetDate = new Date(dateParam);
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const filteredWeatherData = user.weatherData.filter((data) => {
      const dataDate = new Date(data.date);
      return dataDate >= targetDate && dataDate < nextDay;
    });

    res.json({
      success: true,
      data: filteredWeatherData,
    });
  } else {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      success: true,
      data: user.weatherData,
    });
  }
});

const getCurrentWeather = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const { lat, lon } = {
    lat: user.location.coordinates[1],
    lon: user.location.coordinates[0],
  };

  const weatherData = await getWeatherData(lat, lon);

  res.json({
    success: true,
    data: weatherData,
  });
});

module.exports = {
  getUserWeatherData,
  getCurrentWeather,
};

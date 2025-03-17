const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { getWeatherData } = require("../services/weatherService");

const getUserWeatherData = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  if (req.query.date) {
    const targetDate = new Date(req.query.date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const filteredData = user.weatherData.filter(
      (data) => data.date >= targetDate && data.date < nextDay
    );
    return res.json({ success: true, data: filteredData });
  }

  res.json({ success: true, data: user.weatherData });
});

const getCurrentWeather = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  const [lon, lat] = user.location.coordinates;
  const weatherData = await getWeatherData(lat, lon);

  await User.findByIdAndUpdate(user._id, {
    $push: { weatherData: weatherData },
  });

  res.json({ success: true, data: weatherData });
});

module.exports = { getUserWeatherData, getCurrentWeather };

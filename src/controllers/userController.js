const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { getWeatherData } = require("../services/weatherService");

const updateUserLocation = asyncHandler(async (req, res, next) => {
  const { coordinates } = req.body;

  const weatherData = await getWeatherData(coordinates[1], coordinates[0]);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      location: {
        type: "Point",
        coordinates: coordinates,
        cityName: weatherData.cityName,
      },
    },
    { new: true }
  );

  res.json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      location: user.location,
    },
  });
});

module.exports = { updateUserLocation };

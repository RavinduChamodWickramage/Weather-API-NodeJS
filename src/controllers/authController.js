const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { getWeatherData } = require("../services/weatherService");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, location } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return next(new AppError("User already exists", 400));

  const weatherData = await getWeatherData(
    location.coordinates[1],
    location.coordinates[0]
  );

  const user = await User.create({
    email,
    password,
    location: {
      type: "Point",
      coordinates: location.coordinates,
      cityName: weatherData.cityName,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      location: user.location,
      token: generateToken(user._id),
    },
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        location: user.location,
        token: generateToken(user._id),
      },
    });
  } else {
    return next(new AppError("Invalid email or password", 401));
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        location: user.location,
      },
    });
  } else {
    return next(new AppError("User not found", 404));
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};

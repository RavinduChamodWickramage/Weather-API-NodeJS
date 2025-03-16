const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { getLocationDetails } = require("../services/gmapsService");

const updateUserLocation = asyncHandler(async (req, res, next) => {
  const { coordinates } = req.body;

  const cityDetails = await getLocationDetails(coordinates[1], coordinates[0]);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      location: {
        type: "Point",
        coordinates: coordinates,
        cityName: cityDetails.cityName,
      },
    },
    { new: true }
  );

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
  updateUserLocation,
};

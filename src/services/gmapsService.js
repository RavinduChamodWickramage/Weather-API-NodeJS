const axios = require("axios");
const AppError = require("../utils/appError");

const getLocationDetails = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      "http://api.openweathermap.org/geo/1.0/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          limit: 1,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return {
        cityName: "Unknown",
        country: "Unknown",
        formattedAddress: "Unknown location",
      };
    }

    const locationData = response.data[0];

    return {
      cityName: locationData.name || "Unknown",
      country: locationData.country || "Unknown",
      formattedAddress: [
        locationData.name,
        locationData.state,
        locationData.country,
      ]
        .filter(Boolean)
        .join(", "),
    };
  } catch (error) {
    console.error("Error getting location details:", error);
    return {
      cityName: "Unknown",
      country: "Unknown",
      formattedAddress: "Unknown location",
    };
  }
};

module.exports = {
  getLocationDetails,
};

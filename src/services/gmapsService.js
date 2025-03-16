const axios = require("axios");
const AppError = require("../utils/appError");

const getLocationDetails = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status !== "OK") {
      throw new Error("Failed to get location details");
    }

    let cityName = "Unknown";
    let country = "";

    if (response.data.results && response.data.results.length > 0) {
      const addressComponents = response.data.results[0].address_components;

      for (const component of addressComponents) {
        if (component.types.includes("locality")) {
          cityName = component.long_name;
        }
        if (component.types.includes("country")) {
          country = component.long_name;
        }
      }

      if (cityName === "Unknown") {
        for (const component of addressComponents) {
          if (component.types.includes("administrative_area_level_1")) {
            cityName = component.long_name;
            break;
          }
        }
      }
    }

    return {
      cityName,
      country,
      formattedAddress:
        response.data.results[0]?.formatted_address || "Unknown location",
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

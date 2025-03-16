const axios = require("axios");
const AppError = require("../utils/appError");

const getWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      description: response.data.weather[0].description,
      cityName: response.data.name,
      date: new Date(),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new AppError("Failed to fetch weather data", 500);
  }
};

module.exports = {
  getWeatherData,
};

const axios = require("axios");
const AppError = require("../utils/appError");

const getWeatherData = async (lat, lon) => {
  try {
    const [weatherRes, geoRes] = await Promise.all([
      axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
        timeout: 10000,
      }),
      axios.get("http://api.openweathermap.org/geo/1.0/reverse", {
        params: {
          lat,
          lon,
          limit: 1,
          appid: process.env.OPENWEATHER_API_KEY,
        },
        timeout: 10000,
      }),
    ]);

    return {
      temperature: weatherRes.data.main.temp,
      humidity: weatherRes.data.main.humidity,
      windSpeed: weatherRes.data.wind.speed,
      description: weatherRes.data.weather[0].description,
      cityName: geoRes.data[0]?.name || weatherRes.data.name || "Your Location",
      date: new Date(),
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw new AppError("Weather service unavailable", 503);
  }
};

module.exports = { getWeatherData };

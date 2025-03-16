const cron = require("node-cron");
const User = require("../models/User");
const { getWeatherData } = require("../services/weatherService");
const {
  generateWeatherReport,
  generateWeatherReportWithGemini,
} = require("../services/openaiService");
const { sendWeatherEmail } = require("../services/mailService");

const scheduleWeatherJob = () => {
  cron.schedule("0 0,3,6,9,12,15,18,21 * * *", async () => {
    console.log("Running weather report job at:", new Date().toISOString());

    try {
      const users = await User.find({});

      for (const user of users) {
        try {
          const { lat, lon } = {
            lat: user.location.coordinates[1],
            lon: user.location.coordinates[0],
          };

          const weatherData = await getWeatherData(lat, lon);

          let aiDescription;
          try {
            aiDescription = await generateWeatherReport(weatherData);
          } catch (openaiError) {
            console.log("OpenAI error, falling back to Gemini:", openaiError);
            try {
              aiDescription = await generateWeatherReportWithGemini(
                weatherData
              );
            } catch (geminiError) {
              console.log(
                "Gemini error, using basic description:",
                geminiError
              );
              aiDescription = `Weather in ${weatherData.cityName}: ${weatherData.description} with temperature of ${weatherData.temperature}°C.`;
            }
          }

          const weatherDataWithAI = {
            ...weatherData,
            aiDescription,
          };

          await User.findByIdAndUpdate(
            user._id,
            { $push: { weatherData: weatherDataWithAI } },
            { new: true }
          );

          await sendWeatherEmail(user, weatherData, aiDescription);

          console.log(`Weather report sent to ${user.email}`);
        } catch (userError) {
          console.error(
            `Error processing weather for user ${user.email}:`,
            userError
          );
          continue;
        }
      }

      console.log("Weather report job completed at:", new Date().toISOString());
    } catch (error) {
      console.error("Error in weather report job:", error);
    }
  });

  console.log("Weather report job scheduled");
};

module.exports = scheduleWeatherJob;

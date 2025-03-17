const cron = require("node-cron");
const User = require("../models/User");
const { getWeatherData } = require("../services/weatherService");
const { generateWeatherReport } = require("../services/openaiService");
const { sendWeatherEmail } = require("../services/mailService");

const scheduleWeatherJob = () => {
  cron.schedule("0 */3 * * *", async () => {
    try {
      const users = await User.find({});
      console.log(
        `Processing ${users.length} users at ${new Date().toISOString()}`
      );

      for (const user of users) {
        try {
          const coordinates = [...user.location.coordinates];
          const [lon, lat] = coordinates;
          const weather = await getWeatherData(lat, lon);
          const insight = await generateWeatherReport(weather);

          await User.findByIdAndUpdate(user._id, {
            $push: { weatherData: { ...weather, aiDescription: insight } },
          });

          await sendWeatherEmail(user, weather, insight);
          console.log(`Processed user ${user.email}`);
        } catch (userError) {
          console.error(`Failed user ${user.email}:`, userError.message);
        }
      }
    } catch (error) {
      console.error("Job failed:", error);
    }
  });
};

module.exports = scheduleWeatherJob;

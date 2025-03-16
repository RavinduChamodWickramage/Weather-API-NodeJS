require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const scheduleWeatherJob = require("./jobs/weatherJob");

connectDB();

scheduleWeatherJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

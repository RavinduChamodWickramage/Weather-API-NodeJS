const { OpenAI } = require("openai");
const AppError = require("../utils/appError");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateWeatherReport = async (weatherData) => {
  try {
    const prompt = `Generate a short, engaging weather report for ${weatherData.cityName}. 
    Current conditions: ${weatherData.description}, temperature: ${weatherData.temperature}°C, 
    humidity: ${weatherData.humidity}%, wind speed: ${weatherData.windSpeed} m/s. 
    Make it personalized and include practical advice for these weather conditions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful weather reporter providing concise, engaging weather updates.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating AI weather report:", error);
    return `Weather report for ${weatherData.cityName}: ${weatherData.description}, ${weatherData.temperature}°C, ${weatherData.humidity}% humidity, wind speed ${weatherData.windSpeed} m/s.`;
  }
};

const generateWeatherReportWithGemini = async (weatherData) => {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a short, engaging weather report for ${weatherData.cityName}. 
    Current conditions: ${weatherData.description}, temperature: ${weatherData.temperature}°C, 
    humidity: ${weatherData.humidity}%, wind speed: ${weatherData.windSpeed} m/s. 
    Make it personalized and include practical advice for these weather conditions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating Gemini weather report:", error);
    return `Weather report for ${weatherData.cityName}: ${weatherData.description}, ${weatherData.temperature}°C, ${weatherData.humidity}% humidity, wind speed ${weatherData.windSpeed} m/s.`;
  }
};

module.exports = {
  generateWeatherReport,
  generateWeatherReportWithGemini,
};

const { OpenAI } = require("openai");
const AppError = require("../utils/appError");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000,
  maxRetries: 2,
});

const generateWeatherReport = async (weatherData) => {
  try {
    const prompt = `Generate a 3-sentence weather report for ${weatherData.cityName} with these conditions:
    - Temperature: ${weatherData.temperature}°C
    - Humidity: ${weatherData.humidity}%
    - Wind: ${weatherData.windSpeed} m/s
    - Description: ${weatherData.description}
    Include one practical clothing recommendation and one activity suggestion. Use friendly, conversational tone.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new AppError("Weather report generation failed", 503);
  }
};

module.exports = { generateWeatherReport };

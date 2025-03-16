const transporter = require("../config/nodemailer");
const AppError = require("../utils/appError");

const sendWeatherEmail = async (user, weatherData, aiDescription) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: `Weather Update for ${weatherData.cityName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #2c3e50; text-align: center;">Weather Report for ${weatherData.cityName}</h2>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #3498db;">Current Conditions</h3>
            <p style="margin: 5px 0;"><strong>Description:</strong> ${weatherData.description}</p>
            <p style="margin: 5px 0;"><strong>Temperature:</strong> ${weatherData.temperature}°C</p>
            <p style="margin: 5px 0;"><strong>Humidity:</strong> ${weatherData.humidity}%</p>
            <p style="margin: 5px 0;"><strong>Wind Speed:</strong> ${weatherData.windSpeed} m/s</p>
          </div>
          <div style="padding: 15px; border-left: 4px solid #3498db; background-color: #f0f7fc;">
            <h3 style="margin-top: 0; color: #3498db;">Today's Weather Insight</h3>
            <p>${aiDescription}</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
            <p>This is an automated email from Weather Report Service.</p>
            <p>To update your location or preferences, please log in to your account.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
    throw new AppError("Failed to send weather email", 500);
  }
};

module.exports = {
  sendWeatherEmail,
};

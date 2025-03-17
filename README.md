# 🌦️ Weather API

This project is a **Node.js API** that stores user emails and locations, fetches weather data using **OpenWeatherMap**, and sends automated weather reports every 3 hours via email. It uses **MongoDB** for data storage, integrates **OpenAI** for weather summaries, and supports location-based city name retrieval. The API is deployable on **Vercel**.

---

## 🚀 Features

- **User Registration and Login**: Users can register and log in using their email and password.
- **Location-Based Weather Data**: Users can set their location and fetch current weather data.
- **Automated Weather Reports**: Users receive weather reports via email every 3 hours.
- **AI-Powered Weather Summaries**: OpenAI generates weather insights and recommendations.
- **Swagger UI**: Interactive API documentation for easy testing.

---

## 📦 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Weather Data**: OpenWeatherMap API
- **AI Summaries**: OpenAI API
- **Email Notifications**: Nodemailer
- **Deployment**: Vercel
- **Documentation**: Swagger UI

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas (or local MongoDB instance)
- OpenWeatherMap API Key
- OpenAI API Key
- Gmail Account (for sending emails)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Weather-API-NodeJS.git
cd Weather-API-NodeJS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root of your project and add the following variables:

```bash
NODE_ENV=development
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_openweather_api_key
OPENAI_API_KEY=your_openai_api_key
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
```

### 4. Run the Application

- Development Mode

```bash
npm run dev
```

The server will start at http://localhost:5000.

- Production Mode

```bash
npm start
```

### 5. Test the API

Use **Postman** to test the API endpoints:

## 🌐 API Endpoints

**Authentication**
- Register User: **POST /api/auth/register**

- Login User: **POST /api/auth/login**

- Get User Profile: **GET /api/auth/profile**

**User**
- Update User Location: **PUT /api/users/location**

**Weather**
- Get Current Weather: **GET /api/weather/current**

- Get Weather Data for a Specific Date: **GET /api/weather?date=YYYY-MM-DD**

## 🚀 Deployment

- Deploy to Vercel

### 1. Install Vercel CLI:

```bash
npm install -g vercel
```

### 2. Link your project:

```bash
vercel link
```

### 3. Add environment variables:

```bash
vercel env add MONGO_URL
vercel env add JWT_SECRET
vercel env add OPENWEATHER_API_KEY
vercel env add OPENAI_API_KEY
vercel env add GMAIL_USER
vercel env add GMAIL_PASS
```

### 4. Deploy your application:

```bash
vercel --prod
```

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing weather data.
- **OpenAI** for generating weather insights.
- **Vercel** for seamless deployment.

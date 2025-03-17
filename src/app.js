const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Weather API",
      version: "1.0.0",
      description: "Weather API Information",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Weather Report API is running",
  });
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

module.exports = app;

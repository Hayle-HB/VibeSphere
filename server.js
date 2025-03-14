require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes/authRoutes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined", { stream: logger.stream }));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Routes
app.get("/", (req, res) => {
  res.redirect("/auth");
});

// Auth page render
app.get("/auth", (req, res, next) => {
  try {
    res.render("auth", {
      title: "Authentication",
      clientUrl: process.env.CLIENT_URL,
    });
  } catch (error) {
    logger.error(`Error rendering auth view: ${error.message}`);
    next(error);
  }
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

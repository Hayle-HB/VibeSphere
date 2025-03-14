const mongoose = require("mongoose");

// Database configuration options
// const dbOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// };

/**
 * Sets up MongoDB connection event handlers
 */
const setupConnectionHandlers = () => {
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });
};

/**
 * Logs successful database connection
 * @param {mongoose.Connection} connection - Mongoose connection object
 */
const logConnectionSuccess = (connection) => {
  console.log(`MongoDB Connected Successfully - Host: ${connection.host}`);
};

/**
 * Handles database connection errors
 * @param {Error} error - Connection error
 */
const handleConnectionError = (error) => {
  console.error(`Failed to connect to MongoDB: ${error.message}`);
  process.exit(1);
};

/**
 * Establishes connection to MongoDB database using environment variables
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI /*, dbOptions */
    );
    logConnectionSuccess(conn.connection);
    setupConnectionHandlers();
  } catch (error) {
    handleConnectionError(error);
  }
};

module.exports = connectDB;

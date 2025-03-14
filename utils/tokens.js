const jwt = require("jsonwebtoken");
const logger = require("./logger");

/**
 * Generate access token
 * @param {string} userId - User ID
 * @returns {string} JWT access token
 */
const generateToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "1h",
    });
  } catch (error) {
    logger.error("Access token generation failed:", error);
    throw new Error("Error generating access token");
  }
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
    });
  } catch (error) {
    logger.error("Refresh token generation failed:", error);
    throw new Error("Error generating refresh token");
  }
};

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    logger.error("Token verification failed:", error);
    throw new Error("Error verifying token");
  }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    }
    logger.error("Refresh token verification failed:", error);
    throw new Error("Error verifying refresh token");
  }
};

/**
 * Generate token pair (access + refresh)
 * @param {string} userId - User ID
 * @returns {Object} Token pair object
 */
const generateTokenPair = (userId) => {
  try {
    const accessToken = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error("Token pair generation failed:", error);
    throw new Error("Error generating token pair");
  }
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header
 * @returns {string|null} Token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generateTokenPair,
  extractTokenFromHeader,
};

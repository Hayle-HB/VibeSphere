const bcrypt = require("bcrypt");
const crypto = require("crypto");
const logger = require("./logger");

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error("Password hashing failed:", error);
    throw new Error("Error securing password");
  }
};

/**
 * Compare a password with its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error("Password comparison failed:", error);
    throw new Error("Error verifying password");
  }
};

/**
 * Generate a random token
 * @param {number} bytes - Number of bytes for token
 * @returns {string} Random token
 */
const generateRandomToken = (bytes = 32) => {
  try {
    return crypto.randomBytes(bytes).toString("hex");
  } catch (error) {
    logger.error("Random token generation failed:", error);
    throw new Error("Error generating secure token");
  }
};

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted text
 */
const encryptData = (text) => {
  try {
    const algorithm = "aes-256-cbc";
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    logger.error("Data encryption failed:", error);
    throw new Error("Error encrypting data");
  }
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Text to decrypt
 * @returns {string} Decrypted text
 */
const decryptData = (encryptedText) => {
  try {
    const algorithm = "aes-256-cbc";
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    logger.error("Data decryption failed:", error);
    throw new Error("Error decrypting data");
  }
};

/**
 * Hash sensitive data (one-way)
 * @param {string} data - Data to hash
 * @returns {string} Hashed data
 */
const hashData = (data) => {
  try {
    return crypto
      .createHash("sha256")
      .update(data + process.env.HASH_SALT)
      .digest("hex");
  } catch (error) {
    logger.error("Data hashing failed:", error);
    throw new Error("Error hashing data");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomToken,
  encryptData,
  decryptData,
  hashData,
};

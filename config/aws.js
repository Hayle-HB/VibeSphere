const AWS = require("aws-sdk");

/**
 * AWS SDK Configuration
 * Initializes AWS SDK with credentials from environment variables
 * @module config/aws
 */

// AWS credentials and region configuration
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
};

/**
 * Configure AWS SDK with provided credentials and region
 * Throws error if credentials are invalid or missing
 */
try {
  AWS.config.update(awsConfig);
} catch (error) {
  console.error("Failed to configure AWS SDK:", error.message);
  process.exit(1);
}

// Export configured AWS SDK instance
module.exports = AWS;

const User = require("../../models/User");
const { generateToken, generateRefreshToken } = require("../../utils/tokens");
const { hashPassword } = require("../../utils/encryption");
const { sendVerificationEmail } = require("../../service/emailService");
const { validateRegistration } = require("../../utils/validators");
const crypto = require("crypto");
const logger = require("../../utils/logger");

/**
 * User registration controller
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    // Validate registration input
    const { error, value } = validateRegistration(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { email, password, username, firstName, lastName } = value;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Prepare user data
    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user with default settings
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      verification: {
        token: verificationToken,
        expires: verificationExpires,
      },
      isVerified: false,
      profile: {
        displayName: username,
        bio: "",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      },
      status: {
        online: false,
        lastSeen: Date.now(),
      },
      settings: {
        notifications: {
          pushEnabled: true,
          emailEnabled: true,
        },
        privacy: {
          lastSeenVisible: true,
          profilePhotoVisible: true,
        },
      },
    });

    await newUser.save();

    // Generate authentication tokens
    const accessToken = generateToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Prepare response data
    const userData = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      isVerified: false,
      profile: newUser.profile,
    };

    logger.info(`New user registered successfully: ${email}`);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email for verification.",
      data: {
        user: userData,
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
};

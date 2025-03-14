const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * User Schema
 * Defines the data structure and behavior for User documents in MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.oauthProvider;
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // OAuth related fields
    oauthProvider: {
      type: String,
      enum: ["google", "github", "facebook", null],
      default: null,
    },
    oauthId: {
      type: String,
      sparse: true,
      unique: true,
    },
    oauthProfile: {
      type: Object,
      default: null,
    },
    isPasswordSet: {
      type: Boolean,
      default: function () {
        return !this.oauthProvider;
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes
 * Optimizes query performance for commonly accessed fields
 */
userSchema.index({ email: 1, oauthProvider: 1 });

/**
 * Pre-save middleware
 * Automatically hashes passwords before saving to database
 */
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance Methods
 */

/**
 * Compares provided password with stored hash
 * @param {string} candidatePassword - Password to verify
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

/**
 * Checks if user needs to set up a password
 * @returns {boolean} True if password setup is required
 */
userSchema.methods.needsPasswordSetup = function () {
  return this.oauthProvider && !this.isPasswordSet;
};

/**
 * Static Methods
 */

/**
 * Finds a user by email and OAuth provider
 * @param {string} email - User's email address
 * @param {string|null} provider - OAuth provider name
 * @returns {Promise<Document>} Matching user document
 */
userSchema.statics.findByEmailAndProvider = async function (
  email,
  provider = null
) {
  return this.findOne({
    email: email.toLowerCase(),
    oauthProvider: provider,
  });
};

/**
 * Returns user data without sensitive information
 * @returns {Object} Safe user object
 */
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

/**
 * Virtual Properties
 */
userSchema.virtual("fullName").get(function () {
  return this.name;
});

// Create and export User model
const User = mongoose.model("User", userSchema);

module.exports = User;

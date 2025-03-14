const express = require("express");
const router = express.Router();
const {
  register,
} = require("../../controllers/authController/register.controller");
// const { login } = require("../../controllers/authController/login.controller");
// const { logout } = require("../../controllers/authController/logout.controller");
// const {
//   refreshToken,
// } = require("../../controllers/authController/refresh-token.controller");
// const { auth } = require("../../middleware/auth/auth");
// const passport = require("passport");
// const { User } = require("../../models/User");
// const { generateToken } = require("../../utils/generateToken");

// Public routes
router.post("/register", register);
// router.post("/login", login);
// router.post("/refresh-token", refreshToken);

// Protected routes (require authentication)
// router.post("/logout", auth, logout);

// Get current user profile
// router.get("/me", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select(
//       "-password -refreshToken"
//     );
//     res.json({
//       success: true,
//       data: { user },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching user profile",
//     });
//   }
// });

// OAuth routes
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     const token = generateToken(req.user.id);
//     res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
//   }
// );

// Email verification
// router.get("/verify/:token", async (req, res) => {
//   try {
//     const user = await User.findOne({
//       "verification.token": req.params.token,
//       "verification.expires": { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired verification token",
//       });
//     }

//     user.isVerified = true;
//     user.verification = undefined;
//     await user.save();

//     res.json({
//       success: true,
//       message: "Email verified successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error verifying email",
//     });
//   }
// });

module.exports = router;

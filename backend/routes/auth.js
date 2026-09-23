import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { sendOtpEmail } from "../utils/email.js";

const router = express.Router();


// =====================================================
// Helper: Generate 6-digit OTP
// =====================================================

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}


// =====================================================
// Helper: Hash OTP
// =====================================================

function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}


// =====================================================
// Helper: Generate JWT
// =====================================================

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}


// =====================================================
// SIGNUP
// POST /api/auth/signup
// =====================================================

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email and password are required."
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        error: "Username must be at least 3 characters."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    // Check username
    const existingUsername = await User.findOne({
      username: normalizedUsername
    });

    if (existingUsername) {
      return res.status(409).json({
        error: "Username is already taken."
      });
    }

    // Check email
    const existingEmail = await User.findOne({
      email: normalizedEmail
    });

    if (existingEmail) {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // OTP expires after 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,

      emailVerified: false,

      verificationOtpHash: otpHash,
      verificationOtpExpires: otpExpires
    });

    // Send OTP
    try {
      await sendOtpEmail(
        normalizedEmail,
        otp,
        "verification"
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // Remove account if email could not be sent
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        error: "Could not send verification email. Please try again."
      });
    }

    res.status(201).json({
      message: "Account created. Verification OTP sent to your email.",
      email: normalizedEmail
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      error: "Server error during signup."
    });
  }
});


// =====================================================
// VERIFY EMAIL
// POST /api/auth/verify-email
// =====================================================

router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required."
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        error: "Account not found."
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: "Email is already verified."
      });
    }

    // Check expiry
    if (
      !user.verificationOtpExpires ||
      user.verificationOtpExpires < new Date()
    ) {
      return res.status(400).json({
        error: "OTP has expired. Please request a new one."
      });
    }

    // Compare OTP
    const otpHash = hashOtp(otp);

    if (otpHash !== user.verificationOtpHash) {
      return res.status(400).json({
        error: "Invalid OTP."
      });
    }

    // Verify user
    user.emailVerified = true;

    user.verificationOtpHash = null;
    user.verificationOtpExpires = null;

    await user.save();

    const token = createToken(user);

    
    res.json({
      message: "Email verified successfully.",
      token,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,

        subscription: {
          status: user.subscription?.status || "inactive",
          plan: user.subscription?.plan || null,
          expiresAt: user.subscription?.expiresAt || null
        }
      }
    });

  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      error: "Server error during email verification."
    });
  }
});


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    // Check password
    const passwordCorrect = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    // Email must be verified
    if (!user.emailVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in."
      });
    }

    const token = createToken(user);
  
  res.json({
    message: "Login successful.",
    token,

    user: {
      id: user._id,
      username: user.username,
      email: user.email,

      subscription: {
        status: user.subscription?.status || "inactive",
        plan: user.subscription?.plan || null,
        expiresAt: user.subscription?.expiresAt || null
      }
    }
  });


  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Server error during login."
    });
  }
});


// =====================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// =====================================================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.json({
        message: "If an account exists for this email, a reset OTP has been sent."
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    user.resetOtpHash = otpHash;
    user.resetOtpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetOtpAttempts = 0;

    await user.save();

    try {
      await sendOtpEmail(
        normalizedEmail,
        otp,
        "reset"
      );
    } catch (emailError) {
      console.error("Reset email failed:", emailError);

      user.resetOtpHash = null;
      user.resetOtpExpires = null;
      user.resetOtpAttempts = 0;

      await user.save();

      return res.status(500).json({
        error: "Could not send reset email."
      });
    }

    res.json({
      message: "If an account exists for this email, a reset OTP has been sent."
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      error: "Server error during password reset request."
    });
  }
});


// =====================================================
// VERIFY RESET OTP
// POST /api/auth/verify-reset-otp
// =====================================================

router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid OTP."
      });
    }

    // Check attempts
    if (user.resetOtpAttempts >= 5) {
      return res.status(429).json({
        error: "Too many incorrect attempts. Please request a new OTP."
      });
    }

    // Check expiry
    if (
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      return res.status(400).json({
        error: "OTP has expired. Please request a new one."
      });
    }

    const otpHash = hashOtp(otp);

    if (otpHash !== user.resetOtpHash) {
      user.resetOtpAttempts += 1;
      await user.save();

      return res.status(400).json({
        error: "Invalid OTP."
      });
    }

    // Create short-lived reset token
    const resetToken = jwt.sign(
      {
        userId: user._id.toString(),
        purpose: "password-reset"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m"
      }
    );

    res.json({
      message: "OTP verified successfully.",
      resetToken
    });

  } catch (error) {
    console.error("Reset OTP verification error:", error);

    res.status(500).json({
      error: "Server error during OTP verification."
    });
  }
});


// =====================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// =====================================================

router.post("/reset-password", async (req, res) => {
  try {
    const {
      resetToken,
      newPassword
    } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        error: "Reset token and new password are required."
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters."
      });
    }

    // Verify reset token
    let decoded;

    try {
      decoded = jwt.verify(
        resetToken,
        process.env.JWT_SECRET
      );
    } catch {
      return res.status(401).json({
        error: "Reset session has expired. Please start again."
      });
    }

    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        error: "Invalid reset token."
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    // Hash new password
    user.passwordHash = await bcrypt.hash(
      newPassword,
      12
    );

    // Clear reset data
    user.resetOtpHash = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;

    await user.save();

    res.json({
      message: "Password reset successfully."
    });

  } catch (error) {
    console.error("Password reset error:", error);

    res.status(500).json({
      error: "Server error while resetting password."
    });
  }
});


export default router;
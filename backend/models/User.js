import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    // =========================
    // Email Verification
    // =========================

    emailVerified: {
      type: Boolean,
      default: false
    },

    verificationOtpHash: {
      type: String,
      default: null
    },

    verificationOtpExpires: {
      type: Date,
      default: null
    },

    // =========================
    // Password Reset
    // =========================

    resetOtpHash: {
      type: String,
      default: null
    },

    resetOtpExpires: {
      type: Date,
      default: null
    },

    resetOtpAttempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
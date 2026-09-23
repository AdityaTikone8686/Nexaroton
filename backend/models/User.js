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
    },

    // =========================
    // Subscription
    // =========================

    subscription: {
      status: {
        type: String,
        enum: ["inactive", "active", "expired"],
        default: "inactive"
      },

      // Stores the actual selected plan ID
      // Example: iron, diamond, netherite
      plan: {
        type: String,
        enum: ["stone", "iron", "diamond", "netherite", null],
        default: null
      },
      // Date when the subscription ends
      expiresAt: {
        type: Date,
        default: null
      }
    }
  },

  // =========================
  // Timestamps
  // =========================

  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;

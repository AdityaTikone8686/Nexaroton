import "dotenv/config";


import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import forumRoutes from "./routes/forum.js";
import mcPlatformRoutes from "./routes/mcPlatformRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true
  })
);

app.use(express.json());

// ===============================
// Routes
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/minecraft", mcPlatformRoutes);
app.use("/api/payment", paymentRoutes);

// ===============================
// Basic Routes
// ===============================

app.get("/", (req, res) => {
  res.json({
    name: "Orebound API",
    status: "online",
    message: "Orebound backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

// ===============================
// MongoDB Connection
// ===============================

let mongoPromise = null;

async function connectMongoDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  if (!mongoPromise) {
    mongoPromise = mongoose.connect(process.env.MONGO_URI);
  }

  await mongoPromise;

  console.log("MongoDB connected successfully");
}

// ===============================
// Vercel / Local Server
// ===============================

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;

  connectMongoDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log("=================================");
        console.log("MongoDB connected successfully");
        console.log("=================================");
        console.log("=================================");
        console.log(`Orebound backend running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
        console.log("=================================");
      });
    })
    .catch((error) => {
      console.error("Failed to start Orebound backend");
      console.error(error.message);
      process.exit(1);
    });
}

// Vercel uses the exported Express application.
export default async function handler(req, res) {
  try {
    await connectMongoDB();
    return app(req, res);
  } catch (error) {
    console.error("Backend error:", error);

    return res.status(500).json({
      message: "Backend failed to initialize",
      error: error.message
    });
  }
}


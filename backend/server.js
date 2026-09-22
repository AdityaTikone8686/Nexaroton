import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import forumRoutes from "./routes/forum.js";
import mcPlatformRoutes from "./routes/mcPlatformRoutes.js";

const app = express();

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/minecraft", mcPlatformRoutes);

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
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log("=================================");

    app.listen(PORT, () => {
      console.log("=================================");
      console.log(`Orebound backend running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("=================================");
    console.error("Failed to start Orebound backend");
    console.error("=================================");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();
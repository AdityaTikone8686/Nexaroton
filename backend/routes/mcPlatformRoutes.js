import express from "express";
import { mcPlatformApi } from "../services/mcPlatformApi.js";

const router = express.Router();


router.get("/status", async (req, res) => {
  try {
    const data = await mcPlatformApi.getStatus();

    res.json(data);

  } catch (err) {
    console.error(
      "mc-platform status error:",
      err
    );

    res.status(502).json({
      message:
        "Unable to communicate with Minecraft server",
      error: err.message
    });
  }
});


router.post("/start", async (req, res) => {
  try {
    const data = await mcPlatformApi.start();

    res.json(data);

  } catch (err) {
    console.error(
      "mc-platform start error:",
      err
    );

    res.status(502).json({
      message:
        "Unable to start Minecraft server",
      error: err.message
    });
  }
});


router.post("/stop", async (req, res) => {
  try {
    const data = await mcPlatformApi.stop();

    res.json(data);

  } catch (err) {
    console.error(
      "mc-platform stop error:",
      err
    );

    res.status(502).json({
      message:
        "Unable to stop Minecraft server",
      error: err.message
    });
  }
});


router.post("/restart", async (req, res) => {
  try {
    const data = await mcPlatformApi.restart();

    res.json(data);

  } catch (err) {
    console.error(
      "mc-platform restart error:",
      err
    );

    res.status(502).json({
      message:
        "Unable to restart Minecraft server",
      error: err.message
    });
  }
});


export default router;
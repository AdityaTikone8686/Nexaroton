import express from "express";
import jwt from "jsonwebtoken";
import Thread from "../models/Thread.js";
import User from "../models/User.js";

const router = express.Router();

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired authentication token."
    });
  }
}


// GET all threads
router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      threads
    });
  } catch (error) {
    console.error("Failed to fetch threads:", error);

    res.status(500).json({
      error: "Failed to fetch forum threads."
    });
  }
});


// GET single thread
router.get("/threads/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).lean();

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found."
      });
    }

    res.json({
      thread
    });
  } catch (error) {
    console.error("Failed to fetch thread:", error);

    res.status(400).json({
      error: "Invalid thread ID."
    });
  }
});


// CREATE thread
router.post("/threads", authenticate, async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);
    console.log("CONTENT TYPE:", req.headers["content-type"]);
    const { category, title, body } = req.body;

    if (!category || !title?.trim() || !body?.trim()) {
      return res.status(400).json({
        error: "Category, title and message are required."
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        error: "User account not found."
      });
    }

    const thread = await Thread.create({
      category: category.trim(),
      title: title.trim(),
      body: body.trim(),
      authorId: user._id,
      author: user.username,
      replies: []
    });

    res.status(201).json({
      message: "Thread created successfully.",
      thread
    });
  } catch (error) {
    console.error("Failed to create thread:", error);

    res.status(500).json({
      error: "Failed to create thread."
    });
  }
});


// POST reply
router.post(
  "/threads/:id/replies",
  authenticate,
  async (req, res) => {
    try {
      const { body } = req.body;

      if (!body?.trim()) {
        return res.status(400).json({
          error: "Reply cannot be empty."
        });
      }

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(401).json({
          error: "User account not found."
        });
      }

      const thread = await Thread.findById(req.params.id);

      if (!thread) {
        return res.status(404).json({
          error: "Thread not found."
        });
      }

      thread.replies.push({
        authorId: user._id,
        author: user.username,
        body: body.trim()
      });

      await thread.save();

      res.status(201).json({
        message: "Reply posted successfully.",
        thread
      });
    } catch (error) {
      console.error("Failed to post reply:", error);

      res.status(500).json({
        error: "Failed to post reply."
      });
    }
  }
);

export default router;
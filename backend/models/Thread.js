import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    author: {
      type: String,
      required: true
    },

    body: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const threadSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    author: {
      type: String,
      required: true
    },

    replies: {
      type: [replySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
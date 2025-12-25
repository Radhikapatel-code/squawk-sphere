const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "EMERGENCY",
        "ACADEMIC",
        "INTERNSHIP",
        "EVENT",
        "LOST_FOUND",
        "GENERAL",
      ],
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["NORMAL", "HIGH", "CRITICAL"],
      default: "NORMAL",
      index: true,
    },

    badge: {
      type: String,
      enum: ["NONE", "VERIFIED", "OFFICIAL"],
      default: "NONE",
    },

    // 🔥 Engagement tracking
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reportsCount: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Optional (future use)
    commentsCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Index for feed ranking (MATCHES SORT ORDER)
 */
postSchema.index({
  priority: -1,
  likesCount: -1,
  createdAt: -1,
});

module.exports = mongoose.model("Post", postSchema);

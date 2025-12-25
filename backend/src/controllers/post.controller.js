const Post = require("../models/Post");

/**
 * Create a new post
 */
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    const user = req.dbUser; // ✅ USE DB USER FROM MIDDLEWARE

    if (!title || !content || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Only privileged roles can post CRITICAL content
    if (
      priority === "CRITICAL" &&
      !["VERIFIED", "MODERATOR", "ADMIN"].includes(user.role)
    ) {
      return res
        .status(403)
        .json({ error: "Not allowed to post critical alerts" });
    }

    // Badge assignment based on role
    let badge = "NONE";
    if (user.role === "VERIFIED") badge = "VERIFIED";
    if (["MODERATOR", "ADMIN"].includes(user.role)) badge = "OFFICIAL";

    const post = await Post.create({
      author: user._id,
      title,
      content,
      category,
      priority: priority || "NORMAL",
      badge,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get ranked feed
 */
exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find({ isDeleted: false })
      .populate("author", "name role trustScore")
      .sort({
        priority: -1,     // handled by index order
        likesCount: -1,
        createdAt: -1,
      })
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error("Feed error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Like a post
 */
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = req.dbUser;

    if (!post || post.isDeleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.likedBy = post.likedBy || [];

    if (post.likedBy.includes(user._id)) {
      return res.status(400).json({ error: "Already liked" });
    }

    post.likedBy.push(user._id);
    post.likesCount += 1;
    await post.save();

    // Increase author's trust score
    await Post.db.model("User").findByIdAndUpdate(post.author, {
      $inc: { trustScore: 1 },
    });

    res.json({ message: "Post liked" });
  } catch (err) {
    console.error("Like post error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Report a post
 */
exports.reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = req.dbUser;

    if (!post || post.isDeleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.reportedBy = post.reportedBy || [];

    if (post.reportedBy.includes(user._id)) {
      return res.status(400).json({ error: "Already reported" });
    }

    post.reportedBy.push(user._id);
    post.reportsCount += 1;
    await post.save();

    // Decrease author's trust score
    await Post.db.model("User").findByIdAndUpdate(post.author, {
      $inc: { trustScore: -2 },
    });

    res.json({ message: "Post reported" });
  } catch (err) {
    console.error("Report post error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete post (Moderator/Admin)
 */
exports.deletePostByModerator = async (req, res) => {
  try {
    const user = req.dbUser;

    if (!["MODERATOR", "ADMIN"].includes(user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.isDeleted = true;
    await post.save();

    // Heavy trust penalty
    await Post.db.model("User").findByIdAndUpdate(post.author, {
      $inc: { trustScore: -5 },
    });

    res.json({ message: "Post deleted by moderator" });
  } catch (err) {
    console.error("Delete post error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

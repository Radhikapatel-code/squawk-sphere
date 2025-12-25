const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const postController = require("../controllers/post.controller");

// Create post (any authenticated user)
router.post("/", auth, postController.createPost);

// Get feed
router.get("/feed", auth, postController.getFeed);

// Like / Report
router.post("/:id/like", auth, postController.likePost);
router.post("/:id/report", auth, postController.reportPost);

// Delete post (role enforced in controller)
router.delete("/:id", auth, postController.deletePostByModerator);

module.exports = router;

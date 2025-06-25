const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/', auth, upload.single('music'), async (req, res) => {
  const { content, hashtags } = req.body;
  try {
    const post = new Post({
      user: req.user.id,
      content,
      music: req.file ? `/uploads/${req.file.filename}` : null,
      hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim()) : [],
    });
    await post.save();
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      });
    res.json(populatedPost);
  } catch (err) {
    console.error('Post creation error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('following');
    const posts = await Post.find()
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      })
      .sort({ createdAt: -1 });
    // Prioritize posts from followed users
    const sortedPosts = [
      ...posts.filter(post => user.following.includes(post.user._id)),
      ...posts.filter(post => !user.following.includes(post.user._id)),
    ];
    res.json(sortedPosts);
  } catch (err) {
    console.error('Fetch posts error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/hashtag/:tag', auth, async (req, res) => {
  try {
    const posts = await Post.find({ hashtags: req.params.tag })
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      })
      .sort({ $expr: { $add: [{ $size: '$likes' }, { $size: '$comments' }] } })
      .limit(5);
    res.json(posts);
  } catch (err) {
    console.error('Hashtag search error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      });
    res.json(updatedPost);
  } catch (err) {
    console.error('Like error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = new Comment({ user: req.user.id, text });
    await comment.save();
    post.comments.push(comment.id);
    await post.save();
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      });
    res.json(updatedPost);
  } catch (err) {
    console.error('Comment error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
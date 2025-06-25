const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('followers following pendingFollowRequests', 'username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile/me error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers following pendingFollowRequests', 'username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Profile/:id error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/profile', auth, async (req, res) => {
  const { bio, gender } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.bio = bio;
    user.gender = gender;
    user.profileComplete = true;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/follow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (user.id === targetUser.id) return res.status(400).json({ message: 'Cannot follow yourself' });
    if (!targetUser.pendingFollowRequests.includes(req.user.id)) {
      targetUser.pendingFollowRequests.push(req.user.id);
      await targetUser.save();
    }
    res.json({ message: 'Follow request sent' });
  } catch (err) {
    console.error('Follow error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/accept-follow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const requester = await User.findById(req.params.id);
    if (!requester) return res.status(404).json({ message: 'User not found' });
    if (!user.pendingFollowRequests.includes(req.params.id)) {
      return res.status(400).json({ message: 'No pending request from this user' });
    }
    user.followers.push(req.params.id);
    requester.following.push(req.user.id);
    user.pendingFollowRequests = user.pendingFollowRequests.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();
    await requester.save();
    res.json({ message: 'Follow request accepted' });
  } catch (err) {
    console.error('Accept follow error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reject-follow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.pendingFollowRequests.includes(req.params.id)) {
      return res.status(400).json({ message: 'No pending request from this user' });
    }
    user.pendingFollowRequests = user.pendingFollowRequests.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Follow request rejected' });
  } catch (err) {
    console.error('Reject follow error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    user.following = user.following.filter(id => id.toString() !== req.params.id);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user.id);
    await user.save();
    await targetUser.save();
    res.json({ message: 'Unfollowed user' });
  } catch (err) {
    console.error('Unfollow error:', err); // Debug
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
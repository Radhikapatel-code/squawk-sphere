const User = require("../models/User");

exports.syncUser = async (req, res) => {
  try {
    const { uid, email, name, displayName } = req.user;

    // Prefer displayName (Firebase standard)
    const resolvedName = displayName || name || "Anonymous";

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new user
      user = await User.create({
        firebaseUid: uid,
        email,
        name: resolvedName,
        role: "USER",
        trustScore: 0,
      });
    } else {
      // 🔥 Update name if it was missing before
      if (!user.name || user.name === "Unnamed User") {
        user.name = resolvedName;
        await user.save();
      }
    }

    res.json(user);
  } catch (err) {
    console.error("User sync error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

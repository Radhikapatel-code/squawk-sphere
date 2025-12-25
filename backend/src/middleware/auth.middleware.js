const admin = require("../config/firebase"); // ✅ THIS WAS MISSING
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "No authorization token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 🔥 Find user in MongoDB
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(401).json({ error: "User not found in database" });
    }

    // Attach user info to request
    req.user = decodedToken; // Firebase user
    req.dbUser = user;       // MongoDB user

    next();
  } catch (err) {
    console.error("❌ Firebase token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

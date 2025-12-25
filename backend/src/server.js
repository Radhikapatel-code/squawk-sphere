const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// -------------------- ROUTES --------------------
app.get("/", (req, res) => {
  res.send("Community Social App API running");
});

// User routes (SYNC USER)
app.use("/api/users", userRoutes);

// Post routes
app.use("/api/posts", postRoutes);

// -------------------- DATABASE --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err.message);
  });

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

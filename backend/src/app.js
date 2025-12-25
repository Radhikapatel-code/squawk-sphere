const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Community Social App API running");
});

module.exports = app;

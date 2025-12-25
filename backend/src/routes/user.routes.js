const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.post("/sync", auth, userController.syncUser);

module.exports = router;

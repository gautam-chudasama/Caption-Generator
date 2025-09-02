const express = require("express");
const {
  loginController,
  registerController,
  logoutController,
  getMeController,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Authentication routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

// Route to get current user, protected by auth middleware
router.get("/me", authMiddleware, getMeController);

module.exports = router;

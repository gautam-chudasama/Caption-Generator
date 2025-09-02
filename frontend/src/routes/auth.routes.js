const express = require("express");
const {
  loginController,
  registerController,
  logoutController, // Added logoutController
} = require("../controllers/auth.controller");

const router = express.Router();

// Importing the authentication controller
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController); // Added logout route

module.exports = router;

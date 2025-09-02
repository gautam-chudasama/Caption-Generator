const express = require("express");
const {
  loginController,
  registerController,
} = require("../controllers/auth.controller");

const router = express.Router();

// Importing the authentication controller
router.post("/register", registerController);
router.post("/login", loginController);

module.exports = router;

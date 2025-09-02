const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// register controller
async function registerController(req, res) {
  const { username, password } = req.body;

  // Added input validation
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  const userExist = await userModel.findOne({ username });
  if (userExist) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const user = await userModel.create({
    username,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true });

  res.status(201).json({
    message: "Registered successfully",
    user,
  });
}

// login controller
async function loginController(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true });

  res.status(200).json({
    message: "Login successfully",
    user: {
      username: user.username,
      id: user._id,
    },
  });
}

// logout controller
async function logoutController(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
}

// Controller to get current user data
async function getMeController(req, res) {
  // req.user is populated by the authMiddleware
  res.status(200).json({
    message: "User fetched successfully",
    user: {
      username: req.user.username,
      id: req.user._id,
    },
  });
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController,
};
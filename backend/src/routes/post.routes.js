const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const {
  createPostController,
  getPostsController,
} = require("../controllers/post.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// posts api
router.post("/", authMiddleware, upload.single("image"), createPostController);
router.get("/", authMiddleware, getPostsController);

module.exports = router;

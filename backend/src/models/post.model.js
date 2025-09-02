const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: String,
    caption: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Corrected from "users" to "user"
    },
  },
  { timestamps: true } // Added timestamps for sorting
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
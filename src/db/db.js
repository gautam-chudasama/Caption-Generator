const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected successfully");
    })
    .catch((err) => {
      console.log("Errot", err);
    });
}

module.exports = connectDB;

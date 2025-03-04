const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    avatar: String,
    phone: String,
    password: String
}, { collection: "users" });  // Đảm bảo tên đúng với MongoDB

module.exports = mongoose.model("User", userSchema);
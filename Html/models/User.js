const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: { type: String, default: null }, // Đảm bảo không bị unique
    username: String, // Thay vì 'name'
    email: String,
    avatar: String,
    phoneNumber: String, // Thay vì 'phone'
    password: String
}, { collection: "users" });  // Đảm bảo tên đúng với MongoDB

module.exports = mongoose.model("User", userSchema);
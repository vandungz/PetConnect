const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    googleId: { type: String, sparse: true }, // Loại bỏ unique: true
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: false },
    preferredName: { type: String },
    address: { type: String },
    emergencyContact: { type: String },
    verified: { type: Boolean, default: false }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
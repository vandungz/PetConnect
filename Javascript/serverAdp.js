const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5000;

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Pet_Connect-web")
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.log("❌ Lỗi kết nối MongoDB:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Định nghĩa Schema và Model cho Users
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, // Mật khẩu sẽ được mã hóa
    phoneNumber: String
});
const User = mongoose.model("Users", userSchema, "Users");

// API đăng ký
app.post("/register", async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng!" });
        }

        // Mã hóa mật khẩu trước khi lưu vào database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
            phoneNumber
        });

        // Lưu vào database
        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!" });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
});

// API Đăng nhập bằng tên đăng nhập và mật khẩu
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }

    try {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }

        // So sánh mật khẩu đã nhập với mật khẩu trong database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
        }

        res.json({ message: "Đăng nhập thành công!", user });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err });
    }
});

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

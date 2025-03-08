require("dotenv").config(); // Load biến môi trường

const express = require("express");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");

const User = require("./models/User");
const Hotel = require("./models/Hotel");

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Pet_Connect-web", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

mongoose.connection.on("connected", () => console.log("📌 Đang sử dụng database:", mongoose.connection.name));

// Middleware
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Phục vụ file tĩnh từ thư mục "Html"
app.use(express.static(path.join(__dirname, "Html")));

// Phục vụ file tĩnh từ thư mục "Css"
app.use('/Css', express.static(path.join(__dirname, "Css")));

// Phục vụ file tĩnh từ thư mục "js"
app.use('/js', express.static(path.join(__dirname, "js")));

// Cấu hình session với MongoDB store
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/Pet_Connect-web",
        collectionName: "sessions"
    }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 } // 1 ngày
}));

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("🟢 Deserializing user với ID:", id);
        const user = await User.findById(id);
        if (!user) {
            console.error("❌ Không tìm thấy user trong database!");
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        console.error("❌ Lỗi khi deserialize user:", err);
        done(err, null);
    }
});

// Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("🔹 Kiểm tra user với Google ID:", profile.id);
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
            console.log("🟢 Người dùng đã tồn tại:", user);
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
        } else {
            console.log("🚀 Tạo mới người dùng...");
            user = new User({
                googleId: profile.id,
                username: profile.displayName || profile.emails[0].value.split("@")[0], // Tạo username từ email nếu không có
                email: profile.emails?.[0]?.value || "No Email",
                avatar: profile.photos?.[0]?.value || "",
                phoneNumber: null,
                password: null
            });
            await user.save();
            console.log("✅ Người dùng đã được lưu:", user);
        }

        return done(null, user);
    } catch (err) {
        console.error("❌ Lỗi khi xử lý đăng nhập Google:", err);
        return done(err, null);
    }
}));

// Google OAuth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    console.log("🟢 User đăng nhập thành công:", req.user); // Thêm log để kiểm tra
    res.redirect(`http://127.0.0.1:5500/Html/MenuAfterLogin.html?user=${req.user._id}`);
});


// =============================
// 🟢 **PHỤC VỤ FILE HTML**
// =============================

// ✅ 1. Cho phép phục vụ file tĩnh từ thư mục "Html"
app.use(express.static(path.join(__dirname, "Html")));

// ✅ 2. Route riêng cho `ThongTinChiTietKH.html`
app.get("/ThongTinChiTietKH.html", (req, res) => {
    res.sendFile(path.join(__dirname, "ThongTinChiTietKH.html"));
});

// =============================
// 🟢 **API LẤY THÔNG TIN USER**
// =============================
app.get("/profile", async (req, res) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(400).json({ message: "Thiếu ID người dùng!" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Tài khoản không tồn tại!" });
        }

        // Đảm bảo trả về thông tin hợp lệ
        res.json({
            username: user.username || "Tài khoản Google",
            email: user.email,
            phoneNumber: user.phoneNumber || "Không có số điện thoại",
            avatar: user.avatar || "default-avatar.png"
        });
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});
app.get("/api/getUserId", async (req, res) => {
    try {
        // Lấy thông tin user từ request (JWT hoặc session)
        const userId = req.user ? req.user._id : null; 

        if (!userId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập!" });
        }

        res.json({ userId });
    } catch (error) {
        console.error("❌ Lỗi khi lấy userId từ database:", error);
        res.status(500).json({ message: "❌ Lỗi máy chủ!" });
    }
});
// =============================
// 🟢 **API ĐĂNG KÝ & ĐĂNG NHẬP**
// =============================
app.post("/register", async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;
        console.log("🔍 Dữ liệu nhận từ client:", { username, email, password, phoneNumber });

        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email không hợp lệ!" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log("❌ Tên đăng nhập hoặc email đã tồn tại:", { username, email });
            return res.status(400).json({ message: "Tên đăng nhập hoặc email đã được sử dụng!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, phoneNumber });

        await newUser.save();
        console.log("✅ Đăng ký thành công, userId:", newUser._id);
        res.status(201).json({ message: "Đăng ký thành công!", userId: newUser._id });
    } catch (error) {
        console.error("❌ Lỗi server khi đăng ký:", {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        res.status(500).json({
            message: "Lỗi server!",
            error: error.message,
            details: error.stack
        });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("🔍 Đăng nhập với username:", username);
        const user = await User.findOne({ username });
        if (!user) {
            console.log("❌ Không tìm thấy người dùng với username:", username);
            return res.status(400).json({ message: "⚠️ Sai tên đăng nhập hoặc mật khẩu!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Mật khẩu không khớp cho username:", username);
            return res.status(400).json({ message: "⚠️ Sai tên đăng nhập hoặc mật khẩu!" });
        }

        console.log("✅ Đăng nhập thành công, userId:", user._id);
        res.json({ userId: user._id });
    } catch (error) {
        console.error("❌ Lỗi khi đăng nhập:", error);
        res.status(500).json({ message: "❌ Lỗi máy chủ!" });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("❌ Lỗi khi đăng xuất:", err);
            return res.status(500).json({ message: "Lỗi máy chủ!" });
        }
        console.log("✅ Đã đăng xuất, session đã xóa!");
        res.redirect("http://127.0.0.1:3000/login.html");
    });
});
// =============================
// 🟢 **SERVER LISTEN**
// =============================
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy trên http://127.0.0.1:${PORT}`);
});

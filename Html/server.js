require("dotenv").config();  // Đảm bảo dòng này đứng đầu tiên





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

// 🔹 Middleware
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Cấu hình session với MongoDB store
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

// 🔹 Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.id); // Lưu user ID vào session
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

// =======================
// 🚀 Cấu hình Google OAuth
// =======================
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
            console.log("🟢 Người dùng đã tồn tại trong database:", user);
            
            // Nếu user đã có nhưng chưa có googleId, thì cập nhật nó
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
        } else {
            console.log("🚀 Người dùng chưa tồn tại, tạo mới...");

            user = new User({
                googleId: profile.id,
                name: profile.displayName || "No Name",
                email: profile.emails?.[0]?.value || "No Email",
                avatar: profile.photos?.[0]?.value || "",
                phone: null,
                password: null  // Để đảm bảo user Google không có mật khẩu
            });

            await user.save();
            console.log("✅ Người dùng đã được lưu vào database:", user);
        }

        return done(null, user);
    } catch (err) {
        console.error("❌ Lỗi khi xử lý đăng nhập Google:", err);
        return done(err, null);
    }
}));


// ===================
// Google OAuth Routes
// ===================
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect(`http://127.0.0.1:5500/Html/Catalog_phong.html?user=${req.user.id}`);
});

// Route lấy thông tin user
app.get("/profile", async (req, res) => {
    try {
        const userId = req.query.user;
        if (!userId) return res.status(400).json({ error: "Missing user ID" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route logout
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect("/"); 
        });
    });
});

// ===================
// API Đăng ký và Đăng nhập
// ===================
app.post("/register", async (req, res) => {
    try {
        console.log("Dữ liệu nhận được từ client:", req.body); // Debug request

        const { username, email, password, phoneNumber } = req.body;
        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập hoặc email đã được sử dụng!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, phoneNumber });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!" });

    } catch (error) {
        console.error("❌ Lỗi server:", error);  // Debug lỗi chi tiết
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    // So sánh mật khẩu đã nhập với mật khẩu trong database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    res.json({ message: "Đăng nhập thành công!" });
});
app.listen(3000, () => {
    console.log("✅ Server đang chạy trên http://127.0.0.1:3000");
});


// ===================


require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const cors = require("cors");
const User = require("./models/User");

const app = express();

// Cho phép frontend kết nối với backend
app.use(cors({
    origin: "http://127.0.0.1:5500", 
    credentials: true 
}));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
}).then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1);
});

// Cấu hình session
app.use(session({ 
    secret: "secret", 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
                phone: profile.phoneNumbers ? profile.phoneNumbers[0].value : null
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Route đăng nhập Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route xử lý callback từ Google
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    // res.redirect("/Catalog_phong.html");
    res.redirect(`http://127.0.0.1:5500/Html/Catalog_phong.html?user=${req.user.id}`);
});


// Route hiển thị thông tin user
app.get("/profile", (req, res) => {
    if (!req.user) return res.redirect("/");
    res.json({
        id: req.user.googleId,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    });
});

// Route logout
app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

// **Phục vụ file tĩnh**
app.use(express.static(path.join(__dirname, "Html")));

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://127.0.0.1:${PORT}`);
});

app.get("/profile", async (req, res) => {
    const userId = req.query.user; // Lấy user ID từ URL
    if (!userId) return res.json({ error: "Chưa đăng nhập" });

    try {
        const user = await User.findById(userId);
        if (!user) return res.json({ error: "Không tìm thấy user" });

        res.json({
            id: user.googleId,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
});


require("dotenv").config(); // Load biến môi trường

const express = require("express");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcrypt");

const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");

const User = require("./models/User");
const Hotel = require("./models/Hotel");
const Booking = require("./models/Booking");

const app = express();
const PORT = 3000;

// Kết nối MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/Pet_Connect-web", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("✅ Kết nối MongoDB thành công"))
// .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// mongoose.connection.on("connected", () => console.log("📌 Đang sử dụng database:", mongoose.connection.name));

// Kết nối MongoDB Atlas từ .env
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Kết nối MongoDB Atlas thành công"))
.catch((err) => console.error("❌ Lỗi kết nối MongoDB Atlas:", err));

// Middleware
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function parseDDMMYYYY(str) {
    // str dạng "12/03/2025" => [ "12", "03", "2025" ]
    const [day, month, year] = str.split("/");
    return new Date(`${year}-${month}-${day}`); // => "2025-03-12"
}

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
        // mongoUrl: "mongodb://127.0.0.1:27017/Pet_Connect-web",
        mongoUrl: process.env.MONGO_URI, // URI Atlas của bạn
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
                avatar: profile.photos?.[0]?.value || "./assets/img/avaDefault.jpg",
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
            fullName: user.fullName || user.username || "Người dùng chưa cập nhật họ tên",
            phoneNumber: user.phoneNumber || "Không có số điện thoại",
            avatar: user.avatar || "./assets/img/avaDefault.jpg"
        });
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});
app.get("/api/getUserId", async (req, res) => {
    try {
        // Giả sử userId được lưu trong session hoặc token
        const userId = req.session?.userId || req.headers["user-id"];
        if (!userId) {
            return res.status(404).json({ message: "Không tìm thấy userId" });
        }
        res.json({ userId });
    } catch (error) {
        console.error("Lỗi khi lấy userId:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});
// =============================
// 🟢 **API ĐĂNG KÝ & ĐĂNG NHẬP**
// =============================
app.post("/register", async (req, res) => {
    try {
        const { fullName, username, email, password, phoneNumber } = req.body;
        console.log("🔍 Dữ liệu nhận từ client:", { fullName, username, email, password, phoneNumber });

        if (!fullName || !username || !email || !password || !phoneNumber) {
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
        const newUser = new User({fullName, username, email, password: hashedPassword, phoneNumber });

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

        // Thiết lập session cho người dùng
        req.login(user, (err) => {
            if (err) {
                console.error("❌ Lỗi khi đăng nhập:", err);
                return res.status(500).json({ message: "❌ Lỗi máy chủ!" });
            }
            console.log("✅ Đăng nhập thành công, userId:", user._id);
            return res.json({ userId: user._id });
        });
    } catch (error) {
        console.error("❌ Lỗi khi đăng nhập:", error);
        res.status(500).json({ message: "❌ Lỗi máy chủ!" });
    }
});
app.get("/api/currentUser", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập!" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "Tài khoản không tồn tại!" });
        }

        res.json({
            fullName: user.fullName || user.username,
            phoneNumber: user.phoneNumber || "Chưa có số điện thoại",
            address: user.address || "Chưa cập nhật địa chỉ",
            email: user.email || "Chưa có email",
            avatar: user.avatar || "/default-avatar.png" // Avatar mặc định nếu chưa có
        });
    } catch (error) {
        console.error("❌ Lỗi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ngonguyentruongan2907@gmail.com",  // Thay bằng email của bạn
        pass: "liop ubws ajyg gjtq"    // Thay bằng mật khẩu hoặc App Password
    }
});

app.post("/send-email", async (req, res) => {
    const { to, name, phone, address } = req.body;

    const mailOptions = {
        from: "ngonguyentruongan2907@gmail.com",
        to,
        subject: "Xác nhận Yêu Cầu Nhận Nuôi",
        text: `Xin chào ${name},\n\nBạn đã gửi yêu cầu nhận nuôi thú cưng.\n\nThông tin:\nHọ và Tên: ${name}\nSố điện thoại: ${phone}\nĐịa chỉ: ${address}\n\nThời gian áp dụng là trong vòng 3 ngày, nếu sau 3 ngày yêu cầu sẽ bị hủy.\n\nTrân trọng, PetConnect.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email đã gửi thành công!" });
        
    } catch (error) {
        res.json({ success: false, message: "Lỗi khi gửi email", error });
    }
});
const adoptionSchema = new mongoose.Schema({
    petName: { type: String, required: true },
    status1: { type: String, default: "Chưa có thông tin" },
    status2:{ type: String, default: "Chưa có thông tin" },
    adoption: { type: String, default: "Chưa nhận nuôi" },
    imageUrl: String,
    adopter: {
        name: String,
        phone: String,
        address: String,
        email: String,
    },
    adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
const Adoption = mongoose.model("Adoption", adoptionSchema);
app.post("/api/adopt", async (req, res) => {
    try {
        // Kiểm tra người dùng đã đăng nhập hay chưa
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }
        
        // Lấy dữ liệu nhận nuôi từ body và thêm userID
        const adoptionData = req.body;
        adoptionData.adopterId = req.user._id; // Lưu userID từ session

        const newAdoption = new Adoption(adoptionData);
        await newAdoption.save();

        return res.status(201).json({
            success: true,
            message: "Đã lưu yêu cầu nhận nuôi thành công!"
        });
    } catch (error) {
        console.error("❌ Lỗi khi lưu adoption:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lưu adoption"
        });
    }
});


// API lấy danh sách thú cưng đã nhận nuôi theo userId
app.get("/api/adoptedPets/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("userId nhận từ request:", userId); // Debug
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "userId không hợp lệ" });
        }

        const adoptedPets = await Adoption.find({ adopterId: userId });

        console.log("Danh sách thú cưng tìm thấy:", adoptedPets); // Debug
        res.json(adoptedPets);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thú cưng đã nhận nuôi:", error);
        res.status(500).json({ message: "Lỗi server" });
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

app.post("/api/createBooking", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Bạn cần đăng nhập!" });
    }
  
    try {
      // Lấy user từ session để biết fullName và email
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ error: "Không tìm thấy user!" });
      }
  
      const {
        roomName, basicInfo, address,
        checkin, checkout, pet, subtotal, discount
      } = req.body;
  
      // Convert chuỗi ngày checkin/checkout
      const checkinDate = parseDDMMYYYY(checkin);
      const checkoutDate = parseDDMMYYYY(checkout);
      if (isNaN(checkinDate) || isNaN(checkoutDate)) {
        return res.status(400).json({ error: "Ngày checkin/checkout không hợp lệ!" });
      }
  
      // Tạo booking
      const newBooking = new Booking({
        user: user._id,
        userFullName: user.fullName || user.username,
        userEmail: user.email,
        roomName,
        basicInfo,
        address,
        checkin: checkinDate,
        checkout: checkoutDate,
        pet,
        subtotal,
        discount
      });
  
      await newBooking.save();
      console.log("✅ Đã tạo booking sau khi thanh toán:", newBooking._id);
  
      // Trả về booking
      return res.status(201).json(newBooking);
    } catch (error) {
      console.error("❌ Lỗi khi tạo booking:", error);
      return res.status(500).json({ error: "Lỗi server khi tạo booking" });
    }
  });

// Lấy booking theo ID
app.get("/api/hotel/:id", async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ error: "Không tìm thấy booking" });
      }
  
      return res.json(booking);
    } catch (error) {
      console.error("Lỗi khi lấy booking:", error);
      return res.status(500).json({ error: "Lỗi server khi lấy booking" });
    }
});

app.get("/api/my-bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Chưa đăng nhập!" });
    }
    const userId = req.user._id;
    try {
      const bookings = await Booking.find({ user: userId });
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server" });
    }
  });


// --- Endpoint tạo URL thanh toán VNPay ---
const { VNPay, VnpLocale, dateFormat } = require('vnpay');

app.post("/api/vnpay", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Bạn cần đăng nhập!" });
      }
  try {
    // Lấy bookingData do client gửi
    const { bookingData } = req.body;
    if (!bookingData) {
      return res.status(400).json({ error: "Missing bookingData" });
    }

    // Lưu tạm vào session (Cách 1)
    req.session.tempBooking = bookingData;

    // Tính tiền
    const amount = (bookingData.subtotal - bookingData.discount);

    // Khởi tạo VNPay
    const vnpay = new VNPay({
      tmnCode: 'H8CTIAI6',
      secureSecret: 'RF1XTXWL9996OCLW6MY2GFAT4V7KUXQL',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: 'SHA512'
    });

    // Tính ngày giờ
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const randomRef = "TXN_" + Date.now(); // Thay vì bookingId

    // Tạo URL thanh toán
    const vnpayUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: req.ip || '127.0.0.1',
      vnp_TxnRef: randomRef,
      vnp_OrderInfo: `Thanh toán đơn phòng ${bookingData.roomName}`,
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: 'http://127.0.0.1:3000/vnpay_return',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(now, 'yyyyMMddHHmmss'),
      vnp_ExpireDate: dateFormat(tomorrow, 'yyyyMMddHHmmss'),
    });

    // Trả về cho client
    return res.status(200).json({ vnpayUrl });
  } catch (error) {
    console.error("Error in VNPay endpoint:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------
// 3) Route callback: /vnpay_return
// - VNPay sẽ chuyển hướng user về đây sau khi thanh toán
// - Ta kiểm tra kết quả thanh toán => nếu thành công => tạo booking
app.get("/vnpay_return", async (req, res) => {
    try {
      // Bước 1: Kiểm tra user đăng nhập
      if (!req.isAuthenticated()) {
        return res.status(401).send("Bạn cần đăng nhập!");
      }
  
      // Bước 2: Kiểm tra chữ ký, mã giao dịch... (bạn cần code xác thực VNPay)
      // (Ở đây demo bỏ qua, giả sử thanh toán THÀNH CÔNG)
  
      // Bước 3: Lấy bookingData từ session
      const bookingData = req.session.tempBooking;
      if (!bookingData) {
        return res.status(400).send("Không tìm thấy bookingData tạm!");
      }
  
      // Tạo booking
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).send("Không tìm thấy user!");
      }
  
      // Chuyển đổi ngày
      const checkinDate = parseDDMMYYYY(bookingData.checkin);
      const checkoutDate = parseDDMMYYYY(bookingData.checkout);
  
      const newBooking = new Booking({
        user: user._id,
        userFullName: user.fullName || user.username,
        userEmail: user.email,
        roomName: bookingData.roomName,
        basicInfo: bookingData.basicInfo,
        address: bookingData.address,
        checkin: checkinDate,
        checkout: checkoutDate,
        pet: bookingData.pet,
        subtotal: bookingData.subtotal,
        discount: bookingData.discount
      });
      await newBooking.save();
  
      console.log("✅ [VNPay] Đã tạo booking:", newBooking._id);
  
      // Xoá dữ liệu tạm để tránh tái sử dụng
      delete req.session.tempBooking;
  
      // Bước 4: Chuyển hướng sang trang "checked_payment.html"
      return res.redirect("http://127.0.0.1:5500/Html/checked_payment.html");
    } catch (error) {
      console.error("Lỗi /vnpay_return:", error);
      return res.status(500).send("Lỗi server khi xử lý thanh toán!");
    }
  });

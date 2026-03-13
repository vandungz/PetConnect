# PetConnect

PetConnect là hệ thống web hỗ trợ 2 nhu cầu chính cho người nuôi thú cưng:
- Đặt phòng khách sạn thú cưng (Pet Hotel).
- Tìm kiếm và gửi yêu cầu nhận nuôi thú cưng.

Dự án hướng tới trải nghiệm “all-in-one”, giúp người dùng quản lý nhu cầu chăm sóc và nhận nuôi thú cưng trên cùng một nền tảng.

## Chức năng chính

- Đăng ký, đăng nhập tài khoản và quản lý hồ sơ người dùng.
- Đăng nhập bằng Google OAuth.
- Tìm kiếm/xem thông tin thú cưng để nhận nuôi.
- Gửi yêu cầu nhận nuôi và theo dõi danh sách thú cưng đã nhận nuôi.
- Đặt phòng khách sạn thú cưng, xem lịch sử booking.
- Thanh toán trực tuyến cho booking bằng VNPay (sandbox).
- Gửi email xác nhận cho yêu cầu nhận nuôi.

## Công nghệ triển khai

### Frontend
- HTML, CSS, JavaScript thuần.
- Tổ chức theo nhiều trang tĩnh trong thư mục Html.

### Backend
- Node.js + Express.
- API xử lý đăng ký/đăng nhập, nhận nuôi, booking, thanh toán.
- Express Session + Connect Mongo để lưu session.
- Passport + passport-google-oauth20 cho xác thực Google.

### Database
- MongoDB Atlas (Mongoose ODM).
- Các model chính: User, Booking, Hotel, Invoice.

### Tích hợp dịch vụ
- Nodemailer (gửi email).
- VNPay (thanh toán trực tuyến).

## Cấu trúc thư mục chính

- Html/: Giao diện người dùng, CSS/JS, backend server chính và models.
- Javascript/: Một số script chức năng và server thử nghiệm/phụ trợ.
- package.json: Quản lý dependency Node.js.

## Ghi chú

- Dự án hiện dùng mô hình multi-page app (MPA) với frontend thuần.
- Có thể mở rộng theo hướng tách riêng frontend/backend hoặc triển khai Docker, CI/CD trong các phiên bản tiếp theo.

const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  roomName: { type: String, required: true },            // Tên chuồng (container-main-content--left-info-head)
  basicInfo: { type: String, required: true },           // Thông tin cơ bản (container-main-content--left-info-content-name)
  address: { type: String, required: true },             // Địa chỉ (container-content--bottom-location)
  checkin: { type: Date, required: true },               // Ngày check-in (giá trị từ input #checkin)
  checkout: { type: Date, required: true },              // Ngày check-out (giá trị từ input #checkout)
  pet: { type: String, required: true },                 // Thông tin thú cưng (container-main-content--right-prepayment--pet)
  subtotal: { type: Number, required: true },            // Tổng tiền (sum của nightPrice, cleaningFee, serviceFee)
  discount: { type: Number, required: true },            // Phí giảm giá (từ #discount)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hotel", HotelSchema);

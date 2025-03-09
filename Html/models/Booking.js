const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  basicInfo: { type: String, required: true },
  address: { type: String, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  pet: { type: String, required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);

const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  partnerCode: { type: String, required: true },
  amount: { type: Number, required: true },
  orderInfo: { type: String },
  payUrl: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);

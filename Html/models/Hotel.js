const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true }, // Thay "address" bằng "location"
    rating: { type: Number, required: true },
    price_per_night: { type: String, required: true }, // Thay "price" bằng "price_per_night"
    availability: [String], // Mảng ngày (thay "dateRange")
    images: [String]
});

module.exports = mongoose.model("Hotel", hotelSchema);
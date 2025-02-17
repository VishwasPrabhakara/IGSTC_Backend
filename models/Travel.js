const mongoose = require("mongoose");

const TravelDetailsSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    arrivalDate: { type: String, default: null }, 
    arrivalTime: { type: String, default: null },
    departureDate: { type: String, default: null },
    departureTime: { type: String, default: null },
    daysOfStay: { type: Number, default: 0 },
    fieldTrip: { type: Boolean, default: false }
});

module.exports = mongoose.model("TravelDetails", TravelDetailsSchema);

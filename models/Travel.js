const mongoose = require("mongoose");

const TravelSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    arrivalDate: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    departureDate: { type: String, required: true },
    departureTime: { type: String, required: true },
    daysOfStay: { type: Number, required: true },
    fieldTrip: { type: Boolean, required: true },
    residentialAddress: { type: String, required: true }
});

module.exports = mongoose.model("Travel", TravelSchema);

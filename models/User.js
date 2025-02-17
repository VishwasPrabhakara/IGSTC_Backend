const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    accommodation: { 
        venue_name: { type: String, default: "" },
        location_link: { type: String, default: "" }
    }
});

module.exports = mongoose.model("User", UserSchema);

const express = require("express");
const Travel = require("../models/Travel");
const User = require("../models/User"); // Import the User model
const router = express.Router();

// ✅ Save or Update Travel Details with User's Name
router.post("/submit", async (req, res) => {
    try {
        const { userId, arrivalDate, arrivalTime, departureDate, departureTime, daysOfStay, fieldTrip, residentialAddress } = req.body;

        // ✅ Fetch user details from the Users collection
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let travel = await Travel.findOne({ userId });

        if (travel) {
            // ✅ Update existing record
            travel.arrivalDate = arrivalDate;
            travel.arrivalTime = arrivalTime;
            travel.departureDate = departureDate;
            travel.departureTime = departureTime;
            travel.daysOfStay = daysOfStay;
            travel.fieldTrip = fieldTrip;
            travel.residentialAddress = residentialAddress;
            travel.userName = user.name; // ✅ Save the user's name
        } else {
            // ✅ Create new record
            travel = new Travel({
                userId,
                userName: user.name, // ✅ Save the user's name
                arrivalDate,
                arrivalTime,
                departureDate,
                departureTime,
                daysOfStay,
                fieldTrip,
                residentialAddress
            });
        }

        await travel.save();
        res.status(201).json({ message: "Travel details saved successfully!" });
    } catch (err) {
        console.error("Error saving travel details:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Fetch Travel Details with User's Name
router.get("/travels", async (req, res) => {
    try {
        const travelRecords = await Travel.find().exec();
        res.json(travelRecords);
    } catch (error) {
        console.error("Error fetching travel details:", error);
        res.status(500).json({ message: "Error fetching travel details", error: error.message });
    }
});

module.exports = router;

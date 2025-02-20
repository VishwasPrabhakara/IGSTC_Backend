const express = require("express");
const Travel = require("../models/Travel");
const router = express.Router();

// ✅ Save or Update Travel Details
router.post("/submit", async (req, res) => {
    try {
        const { userId, arrivalDate, arrivalTime, departureDate, departureTime, daysOfStay, fieldTrip, residentialAddress } = req.body;

        let travel = await Travel.findOne({ userId }); // Check if user already has travel details

        if (travel) {
            // ✅ Update existing record
            travel.arrivalDate = arrivalDate;
            travel.arrivalTime = arrivalTime;
            travel.departureDate = departureDate;
            travel.departureTime = departureTime;
            travel.daysOfStay = daysOfStay;
            travel.fieldTrip = fieldTrip;
            travel.residentialAddress = residentialAddress;
        } else {
            // ✅ Create new record
            travel = new Travel({
                userId,
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

// ✅ Fetch Travel Details with User Name
router.get("/travels", async (req, res) => {
    try {
        const travelRecords = await Travel.find()
            .populate("userId", "name") // Fetch 'name' from User collection
            .exec();

        res.json(travelRecords);
    } catch (error) {
        console.error("Error fetching travel details:", error);
        res.status(500).json({ message: "Error fetching travel details", error: error.message });
    }
});

module.exports = router;

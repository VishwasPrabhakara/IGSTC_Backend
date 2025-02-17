const express = require("express");
const Travel = require("../models/Travel");
const router = express.Router();

// Save Travel Details
router.post("/submit", async (req, res) => {
    try {
        const travel = new Travel(req.body);
        await travel.save();
        res.status(201).json({ message: "Travel details saved!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

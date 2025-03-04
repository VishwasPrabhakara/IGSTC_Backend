const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


require("dotenv").config();

const app = express();

// Enable CORS for the frontend on Vercel
const FRONTEND_URL = "https://igstcbilateralworkshop2025.in";



app.use(cors({
    origin: "*", // Allow all origins (temporary fix for CORS)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));



// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/travel", require("./routes/travel"));
app.use("/api/upload", require("./routes/upload"));
const downloadsRoutes = require("./routes/downloads");
app.use("/api/downloads", downloadsRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const downloadsRoutes = require("./routes/downloads");

require("dotenv").config();

const app = express();

// Enable CORS for the frontend on Vercel
const FRONTEND_URL = "https://igstcbilateralworkshop2025.in";

app.use(cors({
    origin: FRONTEND_URL, // Allow requests only from your Vercel frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/travel", require("./routes/travel"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/downloads", require("./routes/downloads"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

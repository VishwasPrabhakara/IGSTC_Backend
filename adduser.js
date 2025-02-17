const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Load the User model
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.error("MongoDB Connection Error:", err));

// Function to add a test user
async function addTestUser() {
    try {
        const hashedPassword = await bcrypt.hash("testpassword", 10); // Hash the password

        const newUser = new User({
            username: "testuser",
            password: hashedPassword, // Store hashed password
            name: "Test User",
            email: "testuser@example.com",
            designation: "Speaker",
            accommodation: {
                venue_name: "Test Venue",
                location_link: "https://maps.google.com/testlocation"
            }
        });

        await newUser.save();
        console.log("✅ Test user added successfully!");
    } catch (err) {
        console.error("❌ Error adding test user:", err);
    } finally {
        mongoose.connection.close(); // Close connection after inserting
    }
}

// Run the function
addTestUser();

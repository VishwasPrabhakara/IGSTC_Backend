const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Load the User model
const User = require("./models/User");
const TravelDetails = require("./models/Travel");
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.error("MongoDB Connection Error:", err));

// User data array
const users = [
    { name: "Dr. Christina Bogner", username: "christinabogner", password: "IgstcChr@2025", email: "christina.bogner@uni-koeln.de", designation: "Professor" },
    { name: "Dr. Sanjay Mathur", username: "sanjaymathur", password: "IgstcSan@2025", email: "sanjay.mathur@uni-koeln.de", designation: "Professor" },
    { name: "Dr. Thomas Fischer", username: "thomasfischer", password: "IgstcTho@2025", email: "t.fischer@uni-koeln.de", designation: "Postdoctoral Scientist" },
    { name: "Dr. Lisa Biber-Freudenberger", username: "lisabiber-freudenberger", password: "IgstcLis@2025", email: "lfreuden@uni-bonn.de", designation: "Junior Professor" },
    { name: "Dr. Emanuel Ionescu", username: "emanuelionescu", password: "IgstcEma@2025", email: "emanuel.ionescu@iwks.fraunhofer.de", designation: "Deputy Director, Head Of Department" },
    { name: "Dr. Gesa Beck", username: "gesabeck", password: "IgstcGes@2025", email: "gesa.beck@srh.de", designation: "Professor" },
    { name: "Mr. Winfried Korb", username: "winfriedkorb", password: "IgstcWin@2025", email: "w.korb@arteos.com", designation: "CEO" },
    { name: "Dr. Senol Öz", username: "senolöz", password: "IgstcSen@2025", email: "office@solaveni.com", designation: "Industry Member" },
    { name: "Dr. Peter Fiener", username: "peterfiener", password: "IgstcPet@2025", email: "peter.fiener@geo.uni-augsburg.de", designation: "Professor" },
    { name: "Dr. Anke Nölscher", username: "ankenölscher", password: "IgstcAnk@2025", email: "anke.noelscher@uni-bayreuth.de", designation: "Junior Professor" },
    { name: "Ambika Banotra", username: "ambikabanotra", password: "IgstcAmb@2025", email: "ambika.banotra@nrwglobalbusiness.co.in", designation: "NRW Member (Policy & Law)" },
    { name: "Dr. Silke Christiansen", username: "silkechristiansen", password: "IgstcSil@2025", email: "silke.christiansen@ikts.fraunhofer.de", designation: "Professor" },
    { name: "Dr. Vikas Rana", username: "vikasrana", password: "IgstcVik@2025", email: "v.rana@fz-juelich.de", designation: "Scientist" },
    { name: "Dr. Verena Dlugoß", username: "verenadlugoß", password: "IgstcVer@2025", email: "verena.dlugoss@uni-koeln.de", designation: "Postdoctoral Fellow" },
    { name: "Dr. Payam Kaghazchi", username: "payamkaghazchi", password: "IgstcPay@2025", email: "p.kaghazchi@fz-juelich.de", designation: "Professor, Director" },
    { name: "Dr. L.N. Rao", username: "lnrao", password: "IgstcL.N@2025", email: "narayana@iisc.ac.in", designation: "Associate Professor" },
    { name: "Dr. Sekhar M", username: "sekharm", password: "IgstcSek@2025", email: "muddu@iisc.ac.in", designation: "Professor" },
    { name: "Dr. Navneet Kumar Gupta", username: "navneetkumargupta", password: "IgstcNav@2025", email: "nkgupta@iisc.ac.in", designation: "Assistant Professor" },
    { name: "Dr. Ratheesh", username: "ratheesh", password: "IgstcRat@2025", email: "ratheesh@cmet.gov.in", designation: "Professor" },
    { name: "Dr. Sarala Kumari.J", username: "saralakumarij", password: "IgstcSar@2025", email: "saralaramanand@gmail.com", designation: "Professor" },
    { name: "Dr. Sheshshayee Sreeman", username: "sheshshayeesreeman", password: "IgstcShe@2025", email: "msshesh1@uasbangalore.edu.in", designation: "Professor" },
    { name: "Dr. D Bhagawan", username: "dbhagawan", password: "IgstcD@2025", email: "bhagawan@curaj.ac.in", designation: "Assistant Professor" },
    { name: "Dr. Sairam Bhat", username: "sairambhat", password: "IgstcSai@2025", email: "bhatsairam@nls.ac.in", designation: "Professor" },
    { name: "Dr. Shubha Avinash", username: "shubhaavinash", password: "IgstcShu@2025", email: "savinash@gitam.edu", designation: "Assistant Professor" },
    { name: "Dr. Shamita Kumar", username: "shamitakumar", password: "IgstcSha@2025", email: "shamita.kumar@bharatividyapeeth.edu", designation: "Professor" },
    { name: "Mr. Avinash Krishnamurthy", username: "avinashkrishnamurthy", password: "IgstcAvi@2025", email: "avinash@biome-solutions.com", designation: "Co-founder" },
    { name: "Dr. Prasad S. Murthy", username: "prasadsmurthy", password: "IgstcPra@2025", email: "prasad.sudhakar@gmail.com", designation: "Research Scientist" },
    { name: "Dr. Ganesh Kumar P", username: "ganeshkumarp", password: "IgstcGan@2025", email: "pgkumar@lntecc.com", designation: "Head & Incharge" },
    { name: "Dr. Vijay Sai Prasad", username: "vijaysaiprasad", password: "IgstcVij@2025", email: "vijaysai.prasad@lntecc.com", designation: "Head & Incharge" },
    { name: "Mr. Prabhav Garudadhwajan", username: "prabhavgarudadhwajan", password: "IgstcPra@2025", email: "prabhav@easykrishi.com", designation: "Founder of Industry" }
];

// Function to add multiple users
// Function to add users and travel details
async function addUsers() {
    try {
        for (let user of users) {
            // Hash password before storing
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Create user object
            const newUser = new User({
                username: user.username,
                password: hashedPassword,
                name: user.name,
                email: user.email,
                designation: user.designation,
                accommodation: {
                    venue_name: "",
                    location_link: ""
                }
            });

            await newUser.save();
            console.log(`✅ User ${user.username} added successfully!`);

            // Create travel details object for each user
            const newTravelDetails = new TravelDetails({
                username: user.username,
                arrivalDate: null, // Use null instead of ""
                arrivalTime: null,
                departureDate: null,
                departureTime: null,
                daysOfStay: 0,
                fieldTrip: false
            });

            await newTravelDetails.save();
            console.log(`✅ Travel details created for ${user.username}`);
        }
    } catch (err) {
        console.error("❌ Error adding users or travel details:", err);
    } finally {
        mongoose.connection.close(); // Close connection after inserting
    }
}

// Run the function
addUsers();



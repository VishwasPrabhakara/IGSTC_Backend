const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// AWS S3 Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const S3_BUCKET_NAME = "conference-file-storage"; // Your actual S3 bucket name

// ✅ Middleware to set CORS headers
router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// ✅ Utility Function: Extract Numeric Order from Filenames
const extractNumber = (filename) => {
    const match = filename.match(/^(\d+)[._-]?/); // Supports "1.", "1-", or "1_"
    return match ? parseInt(match[1], 10) : Infinity;
};

// ✅ Fetch & Sort PPTs from S3 (Ensures direct download)
router.get("/ppts", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "ppts/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            console.log("⚠ No PPTs found in S3.");
            return res.json({ ppts: [], message: "No PPTs found in S3 bucket" });
        }

        const ppts = data.Contents
            .filter(file => file.Key !== "ppts/") // Ignore folder entry
            .sort((a, b) => extractNumber(a.Key) - extractNumber(b.Key)) // Natural sorting
            .map(file => ({
                name: file.Key.replace("ppts/", ""), // Remove folder prefix
                url: s3.getSignedUrl("getObject", { 
                    Bucket: S3_BUCKET_NAME, 
                    Key: file.Key, 
                    Expires: 21600, // Signed URL expires in 6 hours
                    ResponseContentDisposition: `attachment; filename="${file.Key.replace("ppts/", "")}"` // Force download
                })
            }));

        console.log(`✅ Retrieved ${ppts.length} PPT files.`);
        res.json({ ppts });
    } catch (error) {
        console.error("❌ Error fetching PPTs:", error);
        res.status(500).json({ error: "Failed to retrieve PPTs" });
    }
});

// ✅ Fetch & Sort Field Trip Photos from S3 (Ensures direct download)
router.get("/field-trip-photos", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "field-trip-photos/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            console.log("⚠ No Field Trip Photos found in S3.");
            return res.json({ photos: [], message: "No Field Trip Photos found in S3 bucket" });
        }

        const photos = data.Contents
            .filter(file => file.Key !== "field-trip-photos/") // Ignore folder entry
            .sort((a, b) => a.Key.localeCompare(b.Key, undefined, { numeric: true })) // Natural sorting
            .map(file => ({
                name: file.Key.replace("field-trip-photos/", ""), // Remove folder prefix
                url: s3.getSignedUrl("getObject", { 
                    Bucket: S3_BUCKET_NAME, 
                    Key: file.Key, 
                    Expires: 21600, // Signed URL expires in 6 hours
                    ResponseContentDisposition: `attachment; filename="${file.Key.replace("field-trip-photos/", "")}"` // Force download
                })
            }));

        console.log(`✅ Retrieved ${photos.length} field trip photos.`);
        res.json({ photos });
    } catch (error) {
        console.error("❌ Error fetching Field Trip Photos:", error);
        res.status(500).json({ error: "Failed to retrieve Field Trip Photos" });
    }
});

// ✅ Handle preflight requests for CORS
router.options("*", (req, res) => {
    res.sendStatus(200);
});

module.exports = router;

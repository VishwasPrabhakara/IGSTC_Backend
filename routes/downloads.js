const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

// AWS S3 Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const S3_BUCKET_NAME = "conference-file-storage"; // Your actual bucket name

// ✅ Fetch list of all PPTs from S3
router.get("/ppts", async (req, res) => {
    try {
        const params = { Bucket: S3_BUCKET_NAME, Prefix: "ppts/" };
        const data = await s3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No PPTs found in S3 bucket" });
        }

        // ✅ Filter out the "ppts/" folder entry and list only actual files
        const ppts = data.Contents
            .filter(file => file.Key !== "ppts/") // Ignore empty folder
            .sort((a, b) => {
                const numA = parseInt(a.Key.match(/^\d+/)?.[0]) || 9999; // Extract number or default high
                const numB = parseInt(b.Key.match(/^\d+/)?.[0]) || 9999;
                return numA - numB; // Sort numerically
            }) // Sort by last modified
            .map(file => ({
                name: file.Key.replace("ppts/", ""), // Remove folder prefix
                url: s3.getSignedUrl("getObject", { 
                    Bucket: S3_BUCKET_NAME, 
                    Key: file.Key, 
                    Expires: 3600 // Link expires in 1 hour
                })
            }));

        res.json({ ppts });
    } catch (error) {
        console.error("❌ Error fetching PPTs:", error);
        res.status(500).json({ error: "Failed to retrieve PPTs" });
    }
});

// ✅ Route to Get Downloadable Event Photos Link
router.get("/photos", (req, res) => {
    try {
        const photoDownloadURL = "https://indianinstituteofscience-my.sharepoint.com/personal/rohanhs_iisc_ac_in/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Frohanhs%5Fiisc%5Fac%5Fin%2FDocuments%2FIGSTC%5F2025%5FIISc%5FLNR&ga=1"; // Replace with actual photo link

        res.json({ photos_url: photoDownloadURL });
    } catch (error) {
        console.error("❌ Error fetching photo download link:", error);
        res.status(500).json({ error: "Failed to retrieve photo download link" });
    }
});

module.exports = router;

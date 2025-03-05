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
            .filter(file => file.Key !== "ppts/") // Remove empty folder
            .map(file => ({
                name: file.Key.replace("ppts/", ""), // Remove "ppts/" prefix from filename
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

module.exports = router;
